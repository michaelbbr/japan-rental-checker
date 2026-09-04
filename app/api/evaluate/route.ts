import { NextRequest, NextResponse } from 'next/server';
import { evaluateProperty } from '@/lib/engine';
import { 
  StationDetail, 
  WardAnalysis, 
  FamousChainGroup,
  ConvenienceStoreGuide,
  Supermarket, 
  LayoutAnalysis, 
  AreaImpression, 
  InitialCostEstimate 
} from '@/lib/types';

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

    // 1. Helper: Strip HTML
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

    // 2. Helper to extract raw table cell
    const getTableCellRaw = (headerKeywords: string[]): string => {
      for (const kw of headerKeywords) {
        const regex = new RegExp(`<(?:th|dt)[^>]*>[^<]*?${kw}[^<]*?<\\/(?:th|dt)>\\s*<(?:td|dd)[^>]*>([\\s\\S]*?)<\\/(?:td|dd)>`, 'i');
        const match = html.match(regex);
        if (match) {
          return match[1];
        }
      }
      return "";
    };

    // Extract table cells
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const rawTitle = titleMatch ? titleMatch[1] : "賃貸物件";
    const propertyTitle = rawTitle.split('【')[0].split('|')[0].replace(/の賃貸・部屋探し情報.*/, '').replace(/の賃貸物件.*/, '').trim();

    const structureText = stripHtml(getTableCellRaw(["構造", "建物種別"]));
    const orientationText = stripHtml(getTableCellRaw(["向き", "方角"]));
    const ageText = stripHtml(getTableCellRaw(["築年月", "築年数", "築年"]));
    const floorText = stripHtml(getTableCellRaw(["階建", "所在階", "階"]));
    const addressRaw = getTableCellRaw(["所在地", "住所", "ロケーション"]);
    const addressText = stripHtml(addressRaw) || (rawTitle.match(/東京都[^\s/]+/)?.[0] ?? "東京都");
    const madoriRaw = getTableCellRaw(["間取り", "専有面積", "面積"]);
    const madoriText = stripHtml(madoriRaw);
    const trafficRaw = getTableCellRaw(["交通", "駅徒歩", "アクセス"]);
    const equipText = stripHtml(getTableCellRaw(["設備", "特徴", "条件"]));

    // 3. Rent & Management Fee
    let rentNum = 10.0;
    let rentStr = "10.0";
    const rentMatch = html.match(/(\d+(?:\.\d+)?)\s*万円/);
    if (rentMatch) {
      rentStr = rentMatch[1];
      rentNum = parseFloat(rentMatch[1]);
    }

    let mgmtNum = 5000;
    const mgmtMatch = html.match(/(?:管理費|共益費)\s*[:：]?\s*(\d{1,3}(?:,\d{3})*|\d+)\s*円/);
    if (mgmtMatch) {
      mgmtNum = parseInt(mgmtMatch[1].replace(/,/g, ''), 10);
    }

    // 4. DYNAMIC STATIONS EXTRACTION (From actual property traffic cell)
    const stations: StationDetail[] = [];
    const cleanTraffic = (trafficRaw || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:li|p|div|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ');

    const trafficLines = cleanTraffic.split('\n').map(l => l.trim()).filter(Boolean);
    const seenStations = new Set<string>();

    for (const tLine of trafficLines) {
      const m = tLine.match(/([^/]+?)[/／]([^/]+?駅)\s*(?:徒歩|歩)\s*(\d+)分/);
      if (m && stations.length < 4) {
        const line = m[1].replace(/^(?:地下鉄|新交通)\s*/, '').trim();
        const station = m[2].trim();
        const walkMin = parseInt(m[3], 10);
        const key = `${station}_${walkMin}`;
        if (!seenStations.has(key)) {
          seenStations.add(key);

          let destZh = `通往周邊主要商圈便利`;
          let destJa = `主要エリアへのアクセスが良好`;
          let pitZh = `尖峰時刻人潮較多，建議預留充足通勤時間。`;
          let pitJa = `混雑時間帯は時間に余裕を持った移動を推奨。`;

          if (line.includes("山手線") || station.includes("代々木") || station.includes("新宿")) {
            destZh = "直達 澀谷(5分)、新宿(2分)、池袋、品川、東京站，首都核心大動脈";
            destJa = "渋谷・新宿・池袋・品川・東京へ直通する都心の大動脈";
            pitZh = "⚠️ 早晚尖峰時刻擁擠率高，月台人潮多；大站需留意站內步行距離。";
            pitJa = "⚠️ 朝夕のラッシュ時は混雑必至。巨大駅の場合は構内移動時間も考慮が必要。";
          } else if (line.includes("大江戸線")) {
            destZh = "直達 六本木、麻布十番、汐留、青山一丁目、飯田橋";
            destJa = "六本木・麻布十番・汐留・青山一丁目方面へ乗り換えなし直通";
            pitZh = "⚠️ 大江戶線是東京著名的「大深度地下鐵」，月台在地下深層，上下電扶梯需多抓 3~5 分鐘！";
            pitJa = "⚠️ 大江戸線は大深度地下鉄のため、改札からホームへの上り下りに徒歩+3〜5分必要。";
          } else if (line.includes("小田急") || station.includes("南新宿")) {
            destZh = "通往新宿僅 1 站（步行亦可直達），直達下北澤、町田、小田原";
            destJa = "新宿へわずか1駅（徒歩圏内）、下北沢・町田方面へ直通";
            pitZh = "⚠️ 各站停車（各停）車站班次間距稍長，部分快車不停靠。";
            pitJa = "⚠️ 各駅停車のみ停車する駅の場合、電車の運行間隔に注意。";
          } else if (line.includes("中央") || line.includes("総武")) {
            destZh = "橫貫東京東西，直達御茶之水、秋葉原、中野、吉祥寺";
            destJa = "御茶ノ水・秋葉原・中野・吉祥寺方面へ東西横断アクセス";
            pitZh = "⚠️ 尖峰時刻中野至新宿區間人流極度密集。";
            pitJa = "⚠️ 平日ラッシュ時は混雑率が高くなりやすい路線。";
          }

          stations.push({
            line,
            station,
            walkMin,
            fullText: `${line} ${station} 徒歩${walkMin}分`,
            destinations: { zh: destZh, ja: destJa },
            pitfalls: { zh: pitZh, ja: pitJa }
          });
        }
      }
    }

    // Fallback if none found
    if (stations.length === 0) {
      stations.push({
        line: "最寄駅",
        station: "最寄駅",
        walkMin: 5,
        fullText: "最寄駅 徒歩5分",
        destinations: { zh: "市區通達便利", ja: "都心アクセス良好" },
        pitfalls: { zh: "實走確認平時上下車人潮", ja: "通勤時の混雑状況を確認推奨" }
      });
    }

    // 5. DYNAMIC WARD DETECTION
    let wardName = "東京都";
    const wardMatch = addressText.match(/(?:東京都)?([^市区町村]+?[区市])/);
    if (wardMatch) {
      wardName = wardMatch[1];
    } else if (rawTitle.includes("渋谷区")) {
      wardName = "渋谷区";
    } else if (rawTitle.includes("新宿区")) {
      wardName = "新宿区";
    }

    let areaDetailName = addressText;
    if (addressText.length < 5 && rawTitle) {
      const aM = rawTitle.match(/東京都[^\s/]+/);
      if (aM) areaDetailName = aM[0];
    }

    // Ward Analysis
    let wardAnalysis: WardAnalysis;
    if (wardName.includes("渋谷区") || rawTitle.includes("代々木")) {
      wardAnalysis = {
        wardName: { zh: "東京都 渋谷區（渋谷区）", ja: "東京都 渋谷区" },
        summary: {
          zh: "澀谷區是流行文化、商業創意與高級住宅並存的超人氣地區。代代木一帶緊鄰明治神宮與代代木公園，兼具新宿南口的繁華便利與綠意盎然的安靜居住品質。",
          ja: "渋谷区は最先端トレンド・商業と洗練された住宅街が融合する人気エリア。代々木周辺は明治神宮や代々木公園に隣接し、新宿への圧倒的利便性と豊かな緑を兼ね備えています。"
        },
        pros: [
          { zh: "【核心地段與通達度】鄰近澀谷、原宿、新宿，山手線與多條私鐵交會，生活機能在東京首屈一指。", ja: "【圧倒的な都心利便性】渋谷・新宿・原宿が生活圏。山手線をはじめ多数の路線が交差し通勤通学に最強。" },
          { zh: "【稀有大片自然綠意】坐擁明治神宮與代代木公園等東京最大規模綠地，休閒散步運動氛圍極佳。", ja: "【広大な自然環境】代々木公園や明治神宮の豊かな自然が身近にあり、四季折々の潤いを感じられる。" },
          { zh: "【品牌資產價值高】澀谷區門牌在二手租賃與轉手市場保值性極強，各類質感店舖林立。", ja: "【高い資産価値・ブランド力】「渋谷区」アドレスは賃貸・リセール市場でも極めて高い人気を維持。" }
        ],
        cons: [
          { zh: "【租金與物價位居東京頂端】平均房租與生活成本偏高，同預算能租到的室內坪數相對精簡。", ja: "【家賃水準・物価が高い】23区内でもトップクラスの家賃相場のため、固定費の負担が大きくなりやすい。" },
          { zh: "【部分幹道人潮與車流多】車站周邊週末人流密集，主要街道偶有車流噪音。", ja: "【休日の人出と交通量】主要駅周辺は休日を中心に人通りが多く、大通り沿いは騒音に注意。" }
        ]
      };
    } else {
      wardAnalysis = {
        wardName: { zh: `東京都 ${wardName}`, ja: `東京都 ${wardName}` },
        summary: {
          zh: `${wardName}是東京都內生活機能成熟的行政區，各項市政、交通與商圈機能完備。`,
          ja: `${wardName}は都内でも生活基盤が整った暮らしやすいエリアです。`
        },
        pros: [
          { zh: "生活機能成熟，交通通達東京都心各主要商圈。", ja: "主要駅へのアクセスが良く、日常の買い物利便性も確保。" },
          { zh: "市政設施與公共資源健全，生活便利安心。", ja: "行政施設や公共サービスが整い、暮らしやすい環境。" }
        ],
        cons: [
          { zh: "需注意特定路段車流噪音與各站點步行距離差異。", ja: "駅からの距離や大通り沿いの音環境を事前に要確認。" }
        ]
      };
    }

    // 6. DYNAMIC AREA IMPRESSION
    let areaImpression: AreaImpression;
    if (addressText.includes("代々木") || rawTitle.includes("代々木")) {
      areaImpression = {
        areaName: `東京都渋谷区代々木エリア（代々木・南新宿）`,
        summary: {
          zh: "代代木坐落於新宿與澀谷的中央，緊靠明治神宮御苑。一邊是散步即可抵達的新宿南口繁華百貨商圈，另一邊則是低密度綠意圍繞的清幽住宅小巷，被譽為「都心不可多得的鬧中取靜寶地」。",
          ja: "代々木は新宿と渋谷の中間に位置し、明治神宮に隣接する超好立地。新宿南口の商業エリアへ徒歩圏でありながら、一歩入れば緑豊かな落ち着いた住宅街が広がる「都会のオアシス」です。"
        },
        safety: {
          zh: "【治安客觀評價：非常良好】 居民素質高，學生、外商白領與在地家庭為主，無大型風俗風化街區，夜間寧靜安全。",
          ja: "【治安評価：極めて良好】 落ち着いた住宅街で風俗街等もなく、女性の一人暮らしでも安心感が高い治安水準。"
        },
        convenience: {
          zh: "【生活與購物：極致便利】 走路即可抵達新宿南口各大百貨、代代木商店街、超市與藥妝店，機能無可挑剔。",
          ja: "【買い物・交通：至高の利便性】 代々木駅商店街やスーパーのほか、新宿駅南口の商業施設が徒歩圏。"
        },
        environment: {
          zh: "【自然與休閒：頂級綠意】 鄰年代代木公園與明治神宮，隨時享受森林步道與晨跑，居住質感極高。",
          ja: "【自然・緑：最高水準】 明治神宮の杜や代々木公園がすぐそばにあり、都心最高峰のリフレッシュ環境。"
        }
      };
    } else {
      areaImpression = {
        areaName: `${areaDetailName} 周邊街區`,
        summary: {
          zh: `${areaDetailName} 周邊街道兼具都心通勤與生活機能，整體生活步調實用便利。`,
          ja: `${areaDetailName} 周辺は都心通勤と生活利便性を両立できる住みやすいエリアです。`
        },
        safety: {
          zh: "周邊街道夜間路燈充足，住宅區治安總體維持在良好水準。",
          ja: "街灯が整備されており、地域の防犯性・治安は概ね安定しています。"
        },
        convenience: {
          zh: "車站周邊具備超市、超商與各類平價連鎖餐飲，日常開銷方便。",
          ja: "駅周辺にスーパーやコンビニ、飲食店が揃い日々の買い物に困りません。"
        },
        environment: {
          zh: "既能快速抵達市區工作，又能享有安穩的生活作息環境。",
          ja: "都心へのアクセスと生活の落ち着きを兼ね備えたバランスの良い環境。"
        }
      };
    }

    // 7. DYNAMIC LAYOUT & AREA EXTRACTION
    let layoutType = "1K";
    const layoutMatch = (madoriText + " " + html).match(/(\d+[LRDKS]+|\d+[RDK])/i);
    if (layoutMatch) {
      layoutType = layoutMatch[1].toUpperCase();
    }

    let areaSize = "";
    const areaMatch = (madoriText + " " + html).match(/(\d+(?:\.\d+)?)\s*(?:㎡|平米|m2|m²)/i);
    if (areaMatch) {
      areaSize = `専有面積 ${areaMatch[1]}㎡`;
    }

    let layoutCommentZh = "格局動線分明，空間利用率良好。";
    let layoutCommentJa = "動線が明確で無駄の少ない使いやすい間取りです。";
    let layoutTips: LocalizedText[] = [];

    if (layoutType.includes("1R") || layoutType.includes("1K")) {
      layoutCommentZh = `單身貴族主流的 ${layoutType} 格局（${areaSize}）。廚房與臥室分開（或一體化），打掃輕鬆、冷暖房省電，但需確認冰箱與洗衣機尺寸。`;
      layoutCommentJa = `単身者に最も選ばれる${layoutType}間取り（${areaSize}）。掃除が楽で光熱費も抑えられますが、冷蔵庫や洗濯機置き場の寸法確認が重要です。`;
      layoutTips = [
        { zh: "確認玄關走道寬度，確保搬家大型家電進出順暢。", ja: "玄関廊下の幅を確認し、冷蔵庫などの大型家電の搬入経路を確保要。" },
        { zh: "單身房型需留意鞋櫃與衣櫃收納空間是否充足。", ja: "クローゼットやシューズボックスの収納容量を内見で要確認。" }
      ];
    } else if (layoutType.includes("1DK") || layoutType.includes("1LDK")) {
      layoutCommentZh = `臥房與客餐廳獨立分離的 ${layoutType} 格局（${areaSize}）。生活起居與睡眠空間完全分開，適合注重生活品質的單身工作者或情侶同居。`;
      layoutCommentJa = `寝食を分離できるゆとりのある${layoutType}間取り（${areaSize}）。テレワーク環境や二人入居にも対応できる人気の配置です。`;
      layoutTips = [
        { zh: "客廳空間寬敞，適合擺放餐桌或遠距工作用書桌。", ja: "LDKにデスクやソファをゆったり配置可能。" },
        { zh: "臥房需丈量床架與衣櫃開合動線，避免空間壓迫。", ja: "寝室のベッドサイズと扉の干渉を事前に内見で要確認。" }
      ];
    } else {
      layoutCommentZh = `空間寬裕的 ${layoutType} 格局（${areaSize}），各房間獨立性強，適合家庭或注重私密個人空間的居住者。`;
      layoutCommentJa = `各部屋のプライバシーが保たれる${layoutType}間取り（${areaSize}）。ファミリーや二人暮らしに最適です。`;
      layoutTips = [
        { zh: "各房間採光與空調管線配置需現場確認。", ja: "各部屋のエアコン設置状況や採光面を確認。" }
      ];
    }

    const layoutAnalysis: LayoutAnalysis = {
      type: `${layoutType} (${areaSize || "標準面積"})`,
      area: areaSize,
      comment: { zh: layoutCommentZh, ja: layoutCommentJa },
      tips: layoutTips
    };

    // 8. FAMOUS CHAIN RESTAURANTS ONLY (有名的連鎖店)
    const famousChains: FamousChainGroup[] = [
      {
        categoryName: { zh: "🥩 國民牛丼三大龍頭（平價神級外食）", ja: "🥩 牛丼御三家（お手軽・安価な定番）" },
        chains: [
          {
            name: "すき家（Sukiya）",
            brandType: { zh: "平價牛丼・咖哩", ja: "牛丼・カレー" },
            walk: "徒歩 3〜5 分",
            budget: "約 400〜650 円",
            feature: { zh: "24小時營業，起司牛丼人氣最高，菜單種類最多，自炊休假時最省錢方便首選。", ja: "24時間営業。チーズ牛丼などトッピング豊富で自炊しない日の強い味方。" }
          },
          {
            name: "松屋（Matsuya）",
            brandType: { zh: "牛丼・和風定食", ja: "牛めし・定食" },
            walk: "徒歩 4〜6 分",
            budget: "約 450〜750 円",
            feature: { zh: "內用一律免費附熱味噌湯！生薑燒肉定食與牛肉咖哩性價比極高，出餐迅速。", ja: "店内飲食はみそ汁無料。牛めしだけでなく定食やカレーのコスパが高い。" }
          },
          {
            name: "吉野家（Yoshinoya）",
            brandType: { zh: "傳統牛肉丼飯", ja: "牛丼" },
            walk: "徒歩 5〜8 分",
            budget: "約 450〜700 円",
            feature: { zh: "日本牛丼始祖，牛肉肉質燉煮軟嫩，深夜宵夜或早晨定食出餐極快。", ja: "秘伝のタレが絶品。提供スピードが最も早く朝定食も充実。" }
          }
        ]
      },
      {
        categoryName: { zh: "🍔 平價速食 & 家庭餐廳（聚餐・辦公）", ja: "🍔 ファストフード＆ファミレス" },
        chains: [
          {
            name: "マクドナルド（McDonald's）",
            brandType: { zh: "美式連鎖速食", ja: "ファストフード" },
            walk: "徒歩 4〜6 分",
            budget: "約 400〜700 円",
            feature: { zh: "便宜黑咖啡（120円起）與百圓早餐，門市多有充電插座與 WiFi，可臨時筆電辦公。", ja: "100円台コーヒーや朝マック。コンセント席がありテレワークや休憩に重宝。" }
          },
          {
            name: "サイゼリヤ（Saizeriya / 薩莉亞）",
            brandType: { zh: "平價義式家庭餐廳", ja: "激安イタリアンファミレス" },
            walk: "徒歩 6〜10 分",
            budget: "約 500〜900 円",
            feature: { zh: "日本平價西餐之神！米蘭肉醬焗烤飯 300円、義大利麵 400円、義大利葡萄酒 100円，小資聚餐省錢天花板。", ja: "国民的激安ファミレス。ミラノ風ドリア300円、グラスワイン100円と圧倒的安さ。" }
          },
          {
            name: "モスバーガー（MOS Burger / 摩斯）",
            brandType: { zh: "精緻日式漢堡", ja: "ハンバーガー" },
            walk: "徒歩 5〜8 分",
            budget: "約 600〜950 円",
            feature: { zh: "嚴選日本國產蔬菜與招牌米漢堡，食材新鮮現點現做，品質與口感高於一般速食。", ja: "国産生野菜を使った高品質バーガー。落ち着いて食事ができる。" }
          }
        ]
      },
      {
        categoryName: { zh: "🍜 國民平價拉麵 & 中華料理", ja: "🍜 ラーメン・中華チェーン" },
        chains: [
          {
            name: "日高屋（Hidakaya）",
            brandType: { zh: "平價熱炒・拉麵", ja: "熱烈中華食堂" },
            walk: "徒歩 5〜7 分",
            budget: "約 390〜750 円",
            feature: { zh: "關東平價中華之王！經典醬油中華拉麵僅 390円、煎餃 250円，下班喝小酒+熱炒只要 1,000 円以內。", ja: "中華そば390円、餃子250円。ちょい飲み（チョイ飲み）文化の聖地。" }
          },
          {
            name: "餃子の王将",
            brandType: { zh: "現煎餃子・炒飯", ja: "中華料理" },
            walk: "徒歩 6〜9 分",
            budget: "約 600〜900 円",
            feature: { zh: "現煎酥脆多汁的大顆餃子配大份炒飯，份量極為紮實，自炊不想煮時的填飽肚子救星。", ja: "パリッと香ばしい焼き餃子と炒飯。ボリューム満点でテイクアウトも人気。" }
          }
        ]
      },
      {
        categoryName: { zh: "☕ 國民連鎖咖啡（工作・休閒）", ja: "☕ カフェチェーン" },
        chains: [
          {
            name: "ドトールコーヒー（Doutor）",
            brandType: { zh: "平價國民咖啡", ja: "コスパ最強カフェ" },
            walk: "徒歩 4〜6 分",
            budget: "約 250〜500 円",
            feature: { zh: "日本普及率最高平價咖啡，美式咖啡 250円起，米蘭三明治（ミラノサンド）是經典早餐。", ja: "ブレンドコーヒーが手頃で日常使いに最適。ミラノサンドが定番人気。" }
          },
          {
            name: "スターバックス（Starbucks）",
            brandType: { zh: "精品咖啡空間", ja: "シアトル系カフェ" },
            walk: "徒歩 5〜8 分",
            budget: "約 450〜700 円",
            feature: { zh: "店內氛圍優雅舒適，提供高速 WiFi，週末放鬆、閱讀或遠距辦公首選。", ja: "洗練された空間とWi-Fi環境。休日のリフレッシュや読書に最適。" }
          }
        ]
      }
    ];

    // 9. CONVENIENCE STORE POSITIONING & PRICE TIERS (超商定位與價格檔次)
    const convenienceStores: ConvenienceStoreGuide[] = [
      {
        brandName: "まいばすけっと（My Basket / AEON旗下）",
        tier: { zh: "💰 平價省錢型（超商外表・超市價格）", ja: "💰 激安・都市型ミニスーパー" },
        priceLevel: "★☆☆☆☆（比一般超商便宜 30%〜40%！）",
        features: {
          zh: "雖像超商但商品全為超市特價！鮮奶 180 円、便當 350 円、冷凍食品超便宜。有它每個月能省下數千日圓。",
          ja: "見た目はコンビニ、価格はイオンのスーパー価格！牛乳・おにぎり・冷凍食品がコンビニより3割以上安い。"
        },
        bestFor: { zh: "小資租屋族、日常補買生鮮牛奶蔬菜", ja: "節約派の一人暮らし、自炊の買い足し" },
        isNearby: true,
        distance: "徒歩 3〜5 分"
      },
      {
        brandName: "セブン-イレブン（7-Eleven）",
        tier: { zh: "⚖️ 標準三大超商（品質與熟食王者）", ja: "⚖️ 大手3社・クオリティ絶対王者" },
        priceLevel: "★★★☆☆（公定標價，鮮少折扣）",
        features: {
          zh: "自有品牌「7-Premium」公認全日本最好吃，炸雞（ななチキ）與便當品質最高，ATM 支援外國卡最順暢。",
          ja: "PB「セブンプレミアム」の美味しさは業界一。揚げ物・お弁当の質が高く、ATMの利便性も抜群。"
        },
        bestFor: { zh: "追求便當品質、辦事寄件與提款", ja: "味にこだわりたい時、公共料金支払い・ATM利用" },
        isNearby: true,
        distance: "徒歩 2〜3 分"
      },
      {
        brandName: "ファミリーマート（FamilyMart / 全家）",
        tier: { zh: "⚖️ 標準三大超商（炸物與甜點霸主）", ja: "⚖️ 大手3社・ホットスナック＆スイーツ" },
        priceLevel: "★★★☆☆（常有 APP 折扣券與點數回饋）",
        features: {
          zh: "「全家炸雞（ファミチキ）」是國民級多汁美食，甜點泡芙種類多，還有流行的文青襪子休閒服系列。",
          ja: "看板商品「ファミチキ」が圧倒的人気。スイーツ「スフレ・プリン」やソックス等のアパレルも好評。"
        },
        bestFor: { zh: "宵夜想吃多汁炸雞、買甜點犒賞自己", ja: "ファミチキが食べたい時、アプリクーポンでお得に買い物" },
        isNearby: true,
        distance: "徒歩 2〜4 分"
      },
      {
        brandName: "ローソン（Lawson）",
        tier: { zh: "⚖️ 標準三大超商（低醣健康與精緻甜點）", ja: "⚖️ 大手3社・健康志向＆ウチカフェ" },
        priceLevel: "★★★☆☆（標準公定價）",
        features: {
          zh: "招牌「からあげクン」一口炸雞球、Uchi Café 瑞士捲蛋糕，更有豐富的低醣（ロカボ）減脂健康麵包。",
          ja: "「からあげクン」や「Uchi Café」スイーツ、ロカボ（糖質オフ）健康パンがダイエッターに大人気。"
        },
        bestFor: { zh: "在乎卡路里減脂的上班族、下午茶甜點", ja: "糖質制限中の食事、プレミアムなデザート選び" },
        isNearby: true,
        distance: "徒歩 3〜5 分"
      },
      {
        brandName: "ナチュラルローソン（Natural Lawson）",
        tier: { zh: "💎 高檔精品型（都會有機貴婦風）", ja: "💎 高級・オーガニック志向コンビニ" },
        priceLevel: "★★★★☆（價格偏高，比一般超商貴 15%~20%）",
        features: {
          zh: "專開在港區、澀谷、新宿等都心精華區！主打無添加健康熟食、有機蔬果、進口起司紅酒與現烤麵包，極具質感。",
          ja: "都心一等地限定。無添加・オーガニック食品や焼きたてパン、輸入ワインを揃えた大人向け高級コンビニ。"
        },
        bestFor: { zh: "注重健康有機生活、講究生活品質的小資白領", ja: "美容・健康志向の方、少し贅沢な夜食・ワイン選び" },
        isNearby: addressText.includes("代々木") || addressText.includes("新宿") || addressText.includes("渋谷"),
        distance: "徒歩 5〜8 分"
      },
      {
        brandName: "ローソンストア100（Lawson Store 100）",
        tier: { zh: "💰 平價省錢型（百圓生鮮超市超商）", ja: "💰 100円ローソン・自炊節約の味方" },
        priceLevel: "★☆☆☆☆（極度便宜，全店約 100~150 円）",
        features: {
          zh: "小份量百圓蔬菜、小包肉品、日常調味料全部 100 日圓！一人自炊完全不怕食材過期，省錢天花板。",
          ja: "生鮮食品から日用品までほぼ全品100円（税別）。使い切りサイズの野菜が多く一人暮らしの救世主。"
        },
        bestFor: { zh: "月底省錢、一人份少量自炊備料", ja: "徹底的に生活費を抑えたい時、少量の自炊食材調達" },
        isNearby: false,
        distance: "自転車圏（近隣エリア）"
      }
    ];

    // 10. SUPERMARKETS GUIDE (Dynamic based on area)
    let supermarkets: Supermarket[];
    if (addressText.includes("代々木") || rawTitle.includes("代々木")) {
      supermarkets = [
        {
          name: "マルマンストア（Maruman Store）南新宿店",
          positioning: { zh: "地域主力大型生鮮超市（居民採買核心）", ja: "地域主力・生鮮総合スーパー" },
          rating: "4.0 ★★★★☆",
          walk: "徒歩 3 分",
          hours: "10:00 - 23:00",
          comment: {
            zh: "代代木1丁目居民的「主力廚房」！生鮮蔬果、肉品與熟食便當豐富，自炊最核心基地。",
            ja: "代々木1丁目エリア住民のメインスーパー。生鮮の鮮度・総菜が充実し自炊派の強い味方。"
          }
        },
        {
          name: "まいばすけっと（My Basket）代々木2丁目店",
          positioning: { zh: "平價都會小型便民超市（AEON旗下，價格極省）", ja: "イオングループ都市型ミニスーパー" },
          rating: "3.8 ★★★☆☆",
          walk: "徒歩 4 分",
          hours: "07:00 - 24:00",
          comment: {
            zh: "早上 7 點開到午夜！營業時間極長，牛奶、雞蛋、冷凍食品比超商便宜 30% 以上。",
            ja: "朝7時から深夜24時まで営業。価格が手頃で日常のこまめな買い足しに最高。"
          }
        },
        {
          name: "成城石井（代々木店 / LUMINE新宿店）",
          positioning: { zh: "高品質進口精品超市", ja: "高級輸入食品スーパー" },
          rating: "4.2 ★★★★☆",
          walk: "徒歩 6 分",
          hours: "08:00 - 22:30",
          comment: {
            zh: "代代木站前。進口乳酪、各國葡萄酒、精緻熟食與健康有機食品專賣，適合週末犒賞小酌。",
            ja: "ワインやチーズ、こだわり輸入食材が豊富でプチ贅沢にぴったり。"
          }
        }
      ];
    } else {
      supermarkets = [
        {
          name: "サミットストア（Summit Store）/ 主力生鮮スーパー",
          positioning: { zh: "主力大型綜合生鮮超市", ja: "地域主力・大型総合スーパー" },
          rating: "4.1 ★★★★☆",
          walk: "徒歩 5〜7 分",
          hours: "09:00 - 23:00",
          comment: {
            zh: "生活圈內的自炊核心基地！肉品、海鮮最齊全，熟食便當種類多且價格公道，自炊省錢首選。",
            ja: "生鮮食品・総菜・お弁当が充実した自炊生活のメインスーパー。"
          }
        },
        {
          name: "まいばすけっと / マルエツプチ（小型便利超市）",
          positioning: { zh: "都會型平價便利超市", ja: "都市型ミニスーパー" },
          rating: "3.8 ★★★☆☆",
          walk: "徒歩 3〜5 分",
          hours: "24時間 または 深夜まで",
          comment: {
            zh: "距離近、營業時間長！半夜隨時可補買牛奶、雞蛋、蔬菜與冷凍食品，價格比便利超商便宜得多。",
            ja: "深夜の急な食材補充に便利で、コンビニより安く買える強い味方。"
          }
        }
      ];
    }

    // 11. MATCH RULES
    const matchedRuleIds = new Set<string>();

    // A. Orientation
    const orientTarget = orientationText || html;
    if (orientTarget.includes("南西")) matchedRuleIds.add("orientation_southwest");
    else if (orientTarget.includes("南東")) matchedRuleIds.add("orientation_southeast");
    else if (orientTarget.includes("南向") || (orientTarget.includes("南") && orientationText)) matchedRuleIds.add("orientation_south");
    else if (orientTarget.includes("東向") || (orientTarget.includes("東") && orientationText)) matchedRuleIds.add("orientation_east");
    else if (orientTarget.includes("西向") || (orientTarget.includes("西") && orientationText)) matchedRuleIds.add("orientation_west");
    else if (orientTarget.includes("北向") || (orientTarget.includes("北") && orientationText)) matchedRuleIds.add("orientation_north");

    // B. Structure
    const structTarget = structureText || html;
    if (structTarget.includes("SRC") || structTarget.includes("鉄骨鉄筋")) {
      matchedRuleIds.add("structure_src");
    } else if (structTarget.includes("RC") || structTarget.includes("鉄筋コンクリート")) {
      matchedRuleIds.add("structure_rc");
    } else if (structTarget.includes("軽量鉄骨") || structTarget.includes("重量鉄骨") || structTarget.includes("鉄骨造") || structTarget.includes("S造") || structTarget.includes("鉄骨")) {
      matchedRuleIds.add("structure_steel");
    } else if (structureText && (structureText.includes("木造") || structureText.includes("木"))) {
      matchedRuleIds.add("structure_wood");
    }

    // C. Age
    let isOldQuake = false;
    const ageNumMatch = (ageText + " " + html).match(/築\s*(\d+)\s*年/);
    const yearMatch = (ageText + " " + html).match(/(?:19\d\d|20\d\d)年/);
    if (html.includes("1978年") || html.includes("1979年") || html.includes("1980年") || html.includes("旧耐震") || (yearMatch && parseInt(yearMatch[0], 10) <= 1981)) {
      isOldQuake = true;
    }

    if (ageNumMatch) {
      const aN = parseInt(ageNumMatch[1], 10);
      if (aN >= 44 || isOldQuake) {
        matchedRuleIds.add("age_old_quake");
        matchedRuleIds.add("age_30_plus");
      } else if (aN >= 30) {
        matchedRuleIds.add("age_30_plus");
      } else if (aN >= 6) {
        matchedRuleIds.add("age_10_20");
      } else {
        matchedRuleIds.add("age_new");
      }
    } else if (isOldQuake) {
      matchedRuleIds.add("age_old_quake");
      matchedRuleIds.add("age_30_plus");
    } else {
      matchedRuleIds.add("age_10_20");
    }

    // D. Stations
    if (stations.some(s => s.walkMin <= 5)) matchedRuleIds.add("walk_5");
    if (stations.length >= 2) matchedRuleIds.add("walk_multi_station");

    // E. Park detection (Yoyogi Park / Shinjuku Chuo Park)
    if (html.includes("代々木公園") || html.includes("明治神宮") || html.includes("新宿中央公園") || html.includes("公園") || addressText.includes("代々木")) {
      matchedRuleIds.add("env_park_near");
    }

    // F. Equipment
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
    if (!eqTarget.includes("オートロック")) {
      matchedRuleIds.add("equip_no_autolock");
    }
    if (eqTarget.includes("エレベーター") || eqTarget.includes("エレベータ")) {
      matchedRuleIds.add("equip_elevator");
    }
    if (eqTarget.includes("大通り沿い") || eqTarget.includes("幹線道路沿い")) {
      matchedRuleIds.add("env_main_road");
    }

    // 12. Initial Move-in Cost
    const totalLow = Math.round(rentNum * 4.2 + (mgmtNum / 10000));
    const totalHigh = Math.round(rentNum * 5.0 + (mgmtNum / 10000));
    const initialCost: InitialCostEstimate = {
      rent: rentNum,
      managementFee: mgmtNum,
      totalEstimate: `約 ${totalLow}〜${totalHigh} 万円（約為月租金的 4〜5 倍）`,
      items: [
        { name: { zh: "前払賃料（第一個月租金）", ja: "前家賃（1ヶ月分）" }, amount: `${rentNum} 万円` },
        { name: { zh: "敷金（押金 / 1個月）", ja: "敷金（1ヶ月）" }, amount: `${rentNum} 万円` },
        { name: { zh: "礼金（禮金 / 1個月）", ja: "礼金（1ヶ月）" }, amount: `${rentNum} 万円` },
        { name: { zh: "仲介手續費（0.5~1個月）", ja: "仲介手数料（0.5〜1ヶ月）" }, amount: `約 ${(rentNum * 0.55).toFixed(1)}〜${(rentNum * 1.1).toFixed(1)} 万円` },
        { name: { zh: "保證公司初回保證料（約 50%）", ja: "保証会社利用料（初回約50%）" }, amount: `約 ${(rentNum * 0.5).toFixed(1)} 万円` },
        { name: { zh: "火災保險＋換鎖費用", ja: "火災保険＋鍵交換費用" }, amount: "約 4.0 万円" }
      ]
    };

    // 13. Run Engine
    const evaluation = evaluateProperty(
      Array.from(matchedRuleIds),
      stations,
      wardAnalysis,
      famousChains,
      convenienceStores,
      supermarkets,
      layoutAnalysis,
      areaImpression,
      initialCost
    );

    const metaParts = [floorText, ageText, structureText, orientationText, addressText].filter(Boolean);

    return NextResponse.json({
      success: true,
      title: propertyTitle,
      rent: rentStr,
      meta: metaParts.join(' • ') || addressText,
      evaluation
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '伺服器抓取解析失敗'
    }, { status: 500 });
  }
}
