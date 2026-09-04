import { NextRequest, NextResponse } from 'next/server';
import { RULES } from '@/lib/rules';
import { evaluateProperty } from '@/lib/engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ success: false, error: '請輸入有效的網址 (需以 http 或 https 開頭)' }, { status: 400 });
    }

    // Server-side fetch bypassing browser CORS
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: `無法讀取房源頁面 (HTTP ${response.status})。請確認該房源網址是否依然公開刊登中。` 
      }, { status: response.status });
    }

    const html = await response.text();

    // 1. Extract Title
    let title = "SUUMO 物件";
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].split('【')[0].split('|')[0].trim();
    }

    // 2. Extract Rent
    let rent = "未記載";
    const rentMatch = html.match(/(\d+(?:\.\d+)?)\s*万円/) || html.match(/(\d{1,3}(?:,\d{3})+)\s*円/);
    if (rentMatch) {
      rent = rentMatch[1];
    }

    // 3. Extract Floor & Age & Station
    let floor = "";
    const floorMatch = html.match(/(\d+)\s*階\s*\/\s*(?:地上)?(\d+)階建/) || html.match(/(\d+)\s*階/);
    if (floorMatch) {
      floor = floorMatch[0];
    }

    let age = "";
    const ageMatch = html.match(/築\s*(\d+)\s*年/);
    if (ageMatch) {
      age = `築${ageMatch[1]}年`;
    }

    let walk = "";
    const walkMatch = html.match(/(?:徒歩|歩)\s*(\d+)\s*分/);
    if (walkMatch) {
      walk = `徒歩${walkMatch[1]}分`;
    }

    // 4. Match Rules from HTML content
    const matchedRuleIds = new Set<string>();

    RULES.forEach(r => {
      for (const k of r.kw) {
        if (html.includes(k)) {
          matchedRuleIds.add(r.id);
          break;
        }
      }
    });

    // Special Checks:
    // Old earthquake standard (旧耐震) / 1978 / 1980 / 築40年以上
    if (html.includes("1978年") || html.includes("1979年") || html.includes("1980年") || html.includes("旧耐震") || (ageMatch && parseInt(ageMatch[1], 10) >= 44)) {
      matchedRuleIds.add("age_old_quake");
      matchedRuleIds.add("age_30_plus");
      matchedRuleIds.delete("age_10_20");
      matchedRuleIds.delete("age_new");
    }

    // Floor logic
    if (floorMatch) {
      const fNum = parseInt(floorMatch[1], 10);
      if (fNum === 1) {
        matchedRuleIds.delete("pos_2f_plus");
        matchedRuleIds.add("pos_1f");
      } else if (fNum >= 2) {
        matchedRuleIds.delete("pos_1f");
        matchedRuleIds.add("pos_2f_plus");
      }
    }

    // Station Walk logic
    if (walkMatch) {
      const wNum = parseInt(walkMatch[1], 10);
      if (wNum <= 5) {
        matchedRuleIds.add("walk_5");
        matchedRuleIds.delete("walk_10");
        matchedRuleIds.delete("walk_15_plus");
      } else if (wNum <= 10) {
        matchedRuleIds.add("walk_10");
        matchedRuleIds.delete("walk_5");
        matchedRuleIds.delete("walk_15_plus");
      } else {
        matchedRuleIds.add("walk_15_plus");
        matchedRuleIds.delete("walk_5");
        matchedRuleIds.delete("walk_10");
      }
    }

    // 5. Evaluate
    const evaluation = evaluateProperty(Array.from(matchedRuleIds));

    return NextResponse.json({
      success: true,
      title,
      rent,
      meta: [floor, age, walk].filter(Boolean).join(' • '),
      matchedCount: matchedRuleIds.size,
      evaluation
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '伺服器抓取解析失敗'
    }, { status: 500 });
  }
}
