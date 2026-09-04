import { NextRequest, NextResponse } from 'next/server';
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

    // 3. Helper to extract table cells by header name
    const getTableCell = (headerKeywords: string[]): string => {
      for (const kw of headerKeywords) {
        // Match <th>kw</th>\s*<td[^>]*>content</td>
        const regex = new RegExp(`<(?:th|dt)[^>]*>[^<]*?${kw}[^<]*?<\\/(?:th|dt)>\\s*<(?:td|dd)[^>]*>([\\s\\S]*?)<\\/(?:td|dd)>`, 'i');
        const match = html.match(regex);
        if (match) {
          return match[1].replace(/<[^>]+>/g, ' ').replace(/[\r\n\t\s]+/g, ' ').trim();
        }
      }
      return "";
    };

    const structureText = getTableCell(["構造", "建物種別"]);
    const orientationText = getTableCell(["向き", "方角"]);
    const ageText = getTableCell(["築年月", "築年数", "築年"]);
    const floorText = getTableCell(["階建", "所在階", "階"]);
    const walkText = getTableCell(["交通", "駅徒歩", "アクセス"]);
    const equipText = getTableCell(["設備", "特徴", "条件"]);

    const matchedRuleIds = new Set<string>();

    // --- 4. STRICT SINGLE-CHOICE MATCHING (Prevents duplicate / conflicting rules) ---

    // A. Orientation (向き) - Exact priority matching
    const orientTarget = orientationText || html;
    if (orientTarget.includes("南西")) {
      matchedRuleIds.add("orientation_southwest");
    } else if (orientTarget.includes("南東")) {
      matchedRuleIds.add("orientation_southeast");
    } else if (orientTarget.includes("北西")) {
      matchedRuleIds.add("orientation_north");
    } else if (orientTarget.includes("北東")) {
      matchedRuleIds.add("orientation_north");
    } else if (orientTarget.includes("南向") || orientTarget.includes("南") && orientationText) {
      matchedRuleIds.add("orientation_south");
    } else if (orientTarget.includes("東向") || orientTarget.includes("東") && orientationText) {
      matchedRuleIds.add("orientation_east");
    } else if (orientTarget.includes("西向") || orientTarget.includes("西") && orientationText) {
      matchedRuleIds.add("orientation_west");
    } else if (orientTarget.includes("北向") || orientTarget.includes("北") && orientationText) {
      matchedRuleIds.add("orientation_north");
    }

    // B. Structure (構造) - Strictly one structure, NEVER false match wood
    const structTarget = structureText || html;
    if (structTarget.includes("SRC") || structTarget.includes("鉄骨鉄筋")) {
      matchedRuleIds.add("structure_src");
    } else if (structTarget.includes("RC") || structTarget.includes("鉄筋コンクリート")) {
      matchedRuleIds.add("structure_rc");
    } else if (structTarget.includes("軽量鉄骨") || structTarget.includes("重量鉄骨") || structTarget.includes("鉄骨造") || structTarget.includes("S造")) {
      matchedRuleIds.add("structure_steel");
    } else if (structureText && (structureText.includes("木造") || structureText.includes("木"))) {
      // Only match wood if it actually appears in the structure cell!
      matchedRuleIds.add("structure_wood");
    }

    // C. Age (築年数)
    let displayAge = "";
    const ageMatch = (ageText + " " + html).match(/築\s*(\d+)\s*年/);
    const yearMatch = (ageText + " " + html).match(/(?:19\d\d|20\d\d)年/);
    
    let isOldQuake = false;
    if (html.includes("1978年") || html.includes("1979年") || html.includes("1980年") || (yearMatch && parseInt(yearMatch[0], 10) <= 1981) || html.includes("旧耐震")) {
      isOldQuake = true;
    }

    if (ageMatch) {
      const ageNum = parseInt(ageMatch[1], 10);
      displayAge = `築${ageNum}年`;
      if (ageNum >= 43 || isOldQuake) {
        matchedRuleIds.add("age_old_quake");
        matchedRuleIds.add("age_30_plus");
      } else if (ageNum >= 30) {
        matchedRuleIds.add("age_30_plus");
      } else if (ageNum >= 6) {
        matchedRuleIds.add("age_10_20");
      } else {
        matchedRuleIds.add("age_new");
      }
    } else if (isOldQuake) {
      displayAge = "築40年以上 (旧耐震)";
      matchedRuleIds.add("age_old_quake");
      matchedRuleIds.add("age_30_plus");
    }

    // D. Floor (所在階)
    let displayFloor = "";
    const floorMatch = (floorText + " " + html).match(/(\d+)\s*階\s*\/\s*(?:地上)?(\d+)階建/) || (floorText + " " + html).match(/(\d+)\s*階/);
    if (floorMatch) {
      displayFloor = floorMatch[0];
      const floorNum = parseInt(floorMatch[1], 10);
      if (floorNum === 1) {
        matchedRuleIds.add("pos_1f");
      } else if (floorNum >= 2) {
        matchedRuleIds.add("pos_2f_plus");
      }
    }

    // Corner room / Top floor
    if ((floorText + " " + equipText + " " + html).includes("最上階")) {
      matchedRuleIds.add("pos_top");
    }
    if ((equipText + " " + html).includes("角部屋") || (equipText + " " + html).includes("角室") || (equipText + " " + html).includes("2面採光")) {
      matchedRuleIds.add("pos_corner");
    }

    // E. Station Walk (駅徒歩)
    let displayWalk = "";
    const walkMatch = (walkText + " " + html).match(/(?:徒歩|歩)\s*(\d+)\s*分/);
    if (walkMatch) {
      const walkMin = parseInt(walkMatch[1], 10);
      displayWalk = `徒歩${walkMin}分`;
      if (walkMin <= 5) {
        matchedRuleIds.add("walk_5");
      } else if (walkMin <= 10) {
        matchedRuleIds.add("walk_10");
      } else {
        matchedRuleIds.add("walk_15_plus");
      }
    }

    // F. Equipment & Environment (設備・環境)
    const eqTarget = equipText + " " + html;
    if (eqTarget.includes("バストイレ別") || eqTarget.includes("バス・トイレ別") || eqTarget.includes("BT別")) {
      matchedRuleIds.add("equip_bt_sep");
    }
    if (eqTarget.includes("洗面所独立") || eqTarget.includes("独立洗面台") || eqTarget.includes("洗面化粧台")) {
      matchedRuleIds.add("equip_washbasin");
    }
    if (eqTarget.includes("室内洗濯機置場") || eqTarget.includes("室内洗濯機置き場") || eqTarget.includes("室内洗濯機")) {
      matchedRuleIds.add("equip_indoor_wash");
    }
    if (eqTarget.includes("オートロック")) {
      matchedRuleIds.add("equip_autolock");
    }
    if (eqTarget.includes("宅配ボックス") || eqTarget.includes("宅配BOX")) {
      matchedRuleIds.add("equip_delivery");
    }
    if (eqTarget.includes("エレベーター") || eqTarget.includes("エレベータ")) {
      matchedRuleIds.add("equip_elevator");
    }
    if (eqTarget.includes("大通り沿い") || eqTarget.includes("幹線道路沿い")) {
      matchedRuleIds.add("env_main_road");
    }
    if (eqTarget.includes("線路沿い") || eqTarget.includes("線路近")) {
      matchedRuleIds.add("env_railway");
    }

    // 5. Evaluate
    const evaluation = evaluateProperty(Array.from(matchedRuleIds));

    return NextResponse.json({
      success: true,
      title,
      rent,
      meta: [displayFloor, displayAge, displayWalk].filter(Boolean).join(' • '),
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
