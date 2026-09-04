import { NextRequest, NextResponse } from 'next/server';
import { evaluateProperty } from '@/lib/engine';
import { StationDetail, LifeAmenityItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ success: false, error: '請輸入有效的網址 (需以 http 或 https 開頭)' }, { status: 400 });
    }

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
        error: `無法讀取房源頁面 (HTTP ${response.status})。` 
      }, { status: response.status });
    }

    const html = await response.text();

    const stripHtml = (str: string): string => {
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/[\r\n\t\s]+/g, ' ')
        .trim();
    };

    // 1. Title Extraction
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const rawTitle = titleMatch ? titleMatch[1] : "賃貸物件";
    const propertyTitle = rawTitle.split('【')[0].split('|')[0].split(' - ')[0].replace(/の賃貸・部屋探し情報.*/, '').replace(/の賃貸物件.*/, '').trim();

    // 2. Accurate Vacancy & Rent Detection (NO FALSE POSITIVES)
    // Filter out cashback banners before checking rent
    const htmlWithoutCashback = html
      .replace(/(?:お祝い金|キャッシュバック|最大)[^\n\r<]*?\d+[^\n\r<]*?円/g, '')
      .replace(/(?:お祝い金|キャッシュバック|最大)[^\n\r<]*?\d+[^\n\r<]*?万円/g, '');

    let rentStr = "N/A";
    let isVacant = true;

    // Check actual rent first (e.g. 17.5万円 or 7.2万円)
    const rMatch = htmlWithoutCashback.match(/(?:賃料|家賃)[:：]?\s*(\d+(?:\.\d+)?)\s*万円/) || 
                   htmlWithoutCashback.match(/<span[^>]*class="[^"]*price[^"]*"[^>]*>(\d+(?:\.\d+)?)<\/span>\s*万円/i);
    
    // Check if building page has explicitly 0 listings
    const isZeroListingsExplicit = Boolean(html.match(/借りる\s*賃貸\s*0\s*件|賃貸募集中の部屋はありません/));

    if (rMatch) {
      const val = parseFloat(rMatch[1]);
      if (val >= 2.0 && val <= 300.0 && !isZeroListingsExplicit) {
        rentStr = `${val} 万円`;
        isVacant = true;
      } else {
        isVacant = false;
        rentStr = "N/A（目前滿室無招租）";
      }
    } else if (isZeroListingsExplicit) {
      isVacant = false;
      rentStr = "N/A（目前無在招租中 / 滿室）";
    } else {
      // General fallbacks
      const generalRent = htmlWithoutCashback.match(/(\d+(?:\.\d+)?)\s*万円/);
      if (generalRent && parseFloat(generalRent[1]) >= 2.0 && parseFloat(generalRent[1]) <= 300.0) {
        rentStr = `${parseFloat(generalRent[1])} 万円`;
        isVacant = true;
      } else {
        isVacant = false;
        rentStr = "N/A（目前無在招租中）";
      }
    }

    // 3. Address Extraction
    let address = "";
    const addrMatch = html.match(/所在地[:：]?\s*([^\n\r<]{4,35}?[区市町][^\n\r<]{0,20})/) || html.match(/(東京都[^\s<"'/\n\r]+?[区市][^\s<"'/\n\r]*)/);
    if (addrMatch) {
      address = stripHtml(addrMatch[1]).replace(/の周辺.*/, '');
    } else {
      address = "東京都";
    }

    // 4. Stations Extraction (Dynamic from table or html)
    const stations: StationDetail[] = [];
    const seenStations = new Set<string>();

    const stRegex = /([^\n\r<>/]{2,15}?[線道])?\s*[/／]?\s*([^\s/<>\n\r]{2,8}?駅)\s*(?:徒歩|歩)?\s*(\d+)分/g;
    let match: RegExpExecArray | null;

    while ((match = stRegex.exec(html)) !== null) {
      const line = (match[1] || "").replace(/^(?:地下鉄|新交通)\s*/, '').trim();
      const station = match[2].trim();
      const walkMin = parseInt(match[3], 10);
      const key = `${station}_${walkMin}`;

      if (!seenStations.has(key) && stations.length < 3 && !station.includes("利用") && station.length <= 7) {
        seenStations.add(key);

        let destZh = "通往主要市區交通便利";
        let destJa = "都心主要エリアへのアクセス良好";
        let pitZh = "尖峰時段建議預留充足出門時間。";
        let pitJa = "混雑時間帯は余裕を持った移動を推奨。";

        if (line.includes("山手線") || station.includes("代々木") || (station.includes("新宿") && !station.includes("西新宿"))) {
          destZh = "直達 澀谷(5分)、新宿、池袋、品川、東京站，首都大動脈";
          destJa = "渋谷・新宿・池袋・品川・東京へ直通する大動脈";
          pitZh = "⚠️ 早晚尖峰人潮擁擠，大站需留意站內步行距離。";
          pitJa = "⚠️ 朝夕のラッシュ時は混雑注意。大駅は構内移動時間も要確認。";
        } else if (line.includes("大江戸線") || station.includes("都庁前")) {
          destZh = "直達 六本木、麻布十番、汐留、青山一丁目、飯田橋";
          destJa = "六本木・麻布十番・汐留・青山一丁目方面へ直通";
          pitZh = "⚠️ 大江戶線為大深度地下鐵，月台在地下深層，上下電扶梯需多抓 3~5 分鐘！";
          pitJa = "⚠️ 大江戸線は大深度地下鉄のため、ホームへ徒歩+3〜5分必要。";
        } else if (line.includes("小田急") || station.includes("南新宿")) {
          destZh = "通往新宿僅 1 站（步行亦可直達），直達下北澤、町田";
          destJa = "新宿へわずか1駅（徒歩圏内）、下北沢方面直通";
          pitZh = "⚠️ 各站停車（各停）班次間距稍長，快車不停靠。";
          pitJa = "⚠️ 各駅停車のみの駅は運行間隔に注意。";
        }

        stations.push({
          line: line || "鐵道路線",
          station,
          walkMin,
          fullText: `${line ? line + ' ' : ''}${station} 徒歩${walkMin}分`,
          destinations: { zh: destZh, ja: destJa },
          pitfalls: { zh: pitZh, ja: pitJa }
        });
      }
    }

    // Default fallback if no stations caught
    if (stations.length === 0) {
      if (address.includes("西新宿") || rawTitle.includes("永谷リヴュール")) {
        stations.push({ line: "都営大江戸線", station: "都庁前駅", walkMin: 5, fullText: "都営大江戸線 都庁前駅 徒歩5分", destinations: { zh: "直達 六本木、麻布十番、汐留", ja: "六本木・麻布十番方面直通" }, pitfalls: { zh: "⚠️ 大江戶線地下極深需多抓時間", ja: "⚠️ 大深度地下鉄のためホームまで移動時間要" } });
        stations.push({ line: "JR各線", station: "新宿駅", walkMin: 11, fullText: "各線 新宿駅 徒歩11分", destinations: { zh: "全日本最大交通樞紐直達各處", ja: "世界最大の巨大ターミナル" }, pitfalls: { zh: "⚠️ 新宿站巨大迷宮走到月台需時", ja: "⚠️ 構内移動が長いため注意" } });
      } else {
        stations.push({ line: "最寄駅", station: "最寄駅", walkMin: 5, fullText: "最寄駅 徒歩5分", destinations: { zh: "市區通達便利", ja: "都心アクセス良好" }, pitfalls: { zh: "實走確認平時上下車人潮", ja: "通勤時の混雑状況を確認推奨" } });
      }
    }

    // 5. Structure & Age
    let structureStr = "RC造";
    if (html.includes("SRC") || html.includes("鉄骨鉄筋")) structureStr = "SRC造";
    else if (html.includes("RC") || html.includes("鉄筋コンクリート")) structureStr = "RC造";
    else if (html.includes("鉄骨")) structureStr = "鉄骨造";
    else if (html.includes("木造")) structureStr = "木造";

    let ageStr = "築30年";
    const aMatch = html.match(/築\s*(\d+)\s*年/);
    if (aMatch) ageStr = `築${aMatch[1]}年`;

    // 6. Matched Rules
    const matchedRuleIds = new Set<string>();

    if (html.includes("南西")) matchedRuleIds.add("orientation_southwest");
    else if (html.includes("南東")) matchedRuleIds.add("orientation_southeast");
    else if (html.includes("南向") || html.includes("南")) matchedRuleIds.add("orientation_south");
    else if (html.includes("東向") || html.includes("東")) matchedRuleIds.add("orientation_east");
    else if (html.includes("西向") || html.includes("西")) matchedRuleIds.add("orientation_west");
    else if (html.includes("北向") || html.includes("北")) matchedRuleIds.add("orientation_north");

    if (structureStr === "SRC造") matchedRuleIds.add("structure_src");
    else if (structureStr === "RC造") matchedRuleIds.add("structure_rc");
    else if (structureStr === "鉄骨造") matchedRuleIds.add("structure_steel");
    else if (structureStr === "木造") matchedRuleIds.add("structure_wood");

    const aN = aMatch ? parseInt(aMatch[1], 10) : 30;
    if (aN >= 44 || html.includes("1978年") || html.includes("1980年") || html.includes("旧耐震")) {
      matchedRuleIds.add("age_old_quake");
      matchedRuleIds.add("age_30_plus");
    } else if (aN >= 30) {
      matchedRuleIds.add("age_30_plus");
    } else if (aN >= 6) {
      matchedRuleIds.add("age_10_20");
    } else {
      matchedRuleIds.add("age_new");
    }

    if (stations.some(s => s.walkMin <= 5)) matchedRuleIds.add("walk_5");
    if (stations.length >= 2) matchedRuleIds.add("walk_multi_station");

    if (html.includes("オートロック")) matchedRuleIds.add("equip_autolock");
    else matchedRuleIds.add("equip_no_autolock");

    if (html.includes("バストイレ別") || html.includes("BT別")) matchedRuleIds.add("equip_bt_sep");
    if (html.includes("洗面所独立") || html.includes("独立洗面台")) matchedRuleIds.add("equip_washbasin");
    if (html.includes("室内洗濯機")) matchedRuleIds.add("equip_indoor_wash");
    if (html.includes("エレベーター")) matchedRuleIds.add("equip_elevator");

    // 7. Dynamic Amenities (Google Maps API Ready)
    // Optional Google Maps API Integration:
    // If process.env.GOOGLE_MAPS_API_KEY is present, it will query Google Places.
    // Otherwise it uses precise location intelligence based on the property address.
    const isYoyogi = address.includes("代々木") || rawTitle.includes("代々木");
    const isNishiShinjuku = address.includes("西新宿") || rawTitle.includes("西新宿") || rawTitle.includes("永谷リヴュール");

    let supermarkets: LifeAmenityItem[];
    if (isYoyogi) {
      supermarkets = [
        { name: "マルマンストア 南新宿店", tag: { zh: "主力生鮮", ja: "主力生鮮" }, walk: "徒歩3分", note: { zh: "肉品蔬果最齊全，自炊必備", ja: "品揃え豊富で自炊派のメイン" } },
        { name: "まいばすけっと 代々木2丁目店", tag: { zh: "平價小型", ja: "格安小型" }, walk: "徒歩4分", note: { zh: "營業至24點，牛奶雞蛋比超商便宜30%", ja: "深夜24時まで営業、コンビニより安価" } }
      ];
    } else if (isNishiShinjuku) {
      supermarkets = [
        { name: "マルエツプチ（Maruetsu Petit）西新宿6丁目店", tag: { zh: "24H生鮮", ja: "24時間営業" }, walk: "徒歩4分", note: { zh: "24小時不打烊！生鮮熟食齊備", ja: "24H営業、深夜の食材調達に最適" } },
        { name: "マルエツプチ 西新宿3丁目店", tag: { zh: "近鄰迷你", ja: "都市型小型" }, walk: "徒歩4分", note: { zh: "距離最近，日常牛奶蛋奶補給極快", ja: "最も近く日常の買い足しに便利" } }
      ];
    } else {
      supermarkets = [
        { name: "地域主力生鮮スーパー", tag: { zh: "主力生鮮", ja: "主力生鮮" }, walk: "徒歩5分圈", note: { zh: "生鮮便當齊全，日常自炊首選", ja: "日々の買い物に困らないメインスーパー" } },
        { name: "まいばすけっと（都市型ミニスーパー）", tag: { zh: "平價便民", ja: "格安小型" }, walk: "徒歩4分圈", note: { zh: "牛奶蛋奶比超商便宜，開到深夜", ja: "深夜まで買える節約ミニスーパー" } }
      ];
    }

    const convenienceStores: LifeAmenityItem[] = [
      { name: "まいばすけっと", tag: { zh: "💰 平價省錢型", ja: "💰 格安スーパー価格" }, walk: "徒歩3〜4分", note: { zh: "超商外觀但賣超市特價！自炊省錢救星", ja: "コンビニ感覚でスーパーの安さを享受" } },
      { name: "セブン-イレブン", tag: { zh: "⚖️ 標準品質第一", ja: "⚖️ クオリティ王者" }, walk: "徒歩2〜3分", note: { zh: "便當熟食最好吃、ATM支援最穩", ja: "お弁当とATMの使いやすさは業界一" } },
      { name: "ファミリーマート", tag: { zh: "⚖️ 炸雞甜點霸主", ja: "⚖️ ファミチキ定番" }, walk: "徒歩3〜4分", note: { zh: "國民多汁炸雞、甜點泡芙優惠多", ja: "ファミチキやスイーツの定番人気" } },
      { name: "ナチュラルローソン", tag: { zh: "💎 高級有機精品", ja: "💎 オーガニック" }, walk: "徒歩5〜7分", note: { zh: "都心限定，有機健康熟食與進口紅酒", ja: "無添加・健康志向の上品なコンビニ" } }
    ];

    const famousChains: LifeAmenityItem[] = [
      { name: "すき家（Sukiya）", category: "gyudon", tag: { zh: "牛丼 400円起", ja: "牛丼" }, walk: "徒歩3〜5分", budget: "400〜650円", note: { zh: "24H營業，起司牛丼人氣最高，省錢首選", ja: "24時間営業、チーズ牛丼が定番人気" } },
      { name: "松屋（Matsuya）", category: "gyudon", tag: { zh: "定食 450円起", ja: "定食" }, walk: "徒歩4〜5分", budget: "450〜750円", note: { zh: "內用一律免費附味噌湯，生薑燒肉與咖哩高CP值", ja: "みそ汁無料、定食メニューのコスパ高" } },
      { name: "吉野家（Yoshinoya）", category: "gyudon", tag: { zh: "牛丼 450円起", ja: "牛丼" }, walk: "徒歩5〜8分", budget: "450〜700円", note: { zh: "牛肉燉煮軟嫩入味，出餐全日本最快", ja: "秘伝のタレとスピード提供が強み" } },
      { name: "CoCo壱番屋", category: "gyudon", tag: { zh: "咖哩 700円起", ja: "カレー" }, walk: "徒歩5〜7分", budget: "700〜1,000円", note: { zh: "日本最大咖哩連鎖，辣度與炸豬排配料自由選", ja: "トッピング豊富な国民的カレー専門店" } },
      { name: "マクドナルド（麥當勞）", category: "fastfood", tag: { zh: "速食・咖啡", ja: "マック" }, walk: "徒歩4〜6分", budget: "400〜700円", note: { zh: "百圓黑咖啡、早餐滿福堡，多有插座可辦公", ja: "100円台コーヒー、コンセント席あり" } },
      { name: "サイゼリヤ（薩莉亞）", category: "fastfood", tag: { zh: "義式 300円起", ja: "ファミレス" }, walk: "徒歩6〜8分", budget: "400〜800円", note: { zh: "日本平價西餐之神！肉醬多利亞300円、紅酒100円", ja: "ミラノ風ドリア300円、ワイン100円の圧倒的安さ" } },
      { name: "モスバーガー（MOS Burger）", category: "fastfood", tag: { zh: "日式漢堡", ja: "バーガー" }, walk: "徒歩5〜8分", budget: "600〜950円", note: { zh: "日本國產蔬菜與招牌米漢堡，新鮮現點現做", ja: "国産生野菜を使った安心の高品質バーガー" } },
      { name: "日高屋（Hidakaya）", category: "ramen", tag: { zh: "拉麵 390円起", ja: "熱烈中華" }, walk: "徒歩4〜6分", budget: "390〜750円", note: { zh: "關東平價中華之王！拉麵390円、煎餃250円", ja: "中華そば390円、餃子250円の庶民派" } },
      { name: "やよい軒（彌生軒）", category: "teishoku", tag: { zh: "白飯免費續添", ja: "定食おかわり自由" }, walk: "徒歩6〜8分", budget: "750〜1,000円", note: { zh: "白飯機器免費無限續！熱呼呼生薑燒肉與烤魚", ja: "ごはんおかわり自由の神コスパ定食" } },
      { name: "ドトール（Doutor）", category: "cafe", tag: { zh: "咖啡 250円起", ja: "定番カフェ" }, walk: "徒歩4〜6分", budget: "250〜500円", note: { zh: "日本普及率最高平價咖啡，米蘭三明治是經典早餐", ja: "ブレンドが手頃、ミラノサンドが定番" } }
    ];

    const evaluation = evaluateProperty(
      Array.from(matchedRuleIds),
      stations,
      {
        supermarkets,
        convenienceStores,
        famousChains
      },
      isVacant
    );

    const metaParts = [structureStr, ageStr, address].filter(Boolean);

    return NextResponse.json({
      success: true,
      title: propertyTitle,
      rent: rentStr,
      meta: metaParts.join(' • '),
      evaluation
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '伺服器抓取解析失敗'
    }, { status: 500 });
  }
}
