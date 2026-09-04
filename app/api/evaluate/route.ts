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
        error: `無法讀取房源頁面 (HTTP ${response.status})。請確認該網址依然公開刊登中。` 
      }, { status: response.status });
    }

    const html = await response.text();

    // 1. Strip HTML tags cleanly
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

    // 2. Extract Title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const rawTitle = titleMatch ? titleMatch[1] : "賃貸物件";
    const propertyTitle = rawTitle.split('【')[0].split('|')[0].split(' - ')[0].replace(/の賃貸・部屋探し情報.*/, '').replace(/の賃貸物件.*/, '').trim();

    // 3. Extract Rent & Management Fee
    let rentNum = 0;
    let rentStr = "";
    const rentMatch = html.match(/(\d+(?:\.\d+)?)\s*万円/);
    if (rentMatch) {
      rentStr = rentMatch[1];
      rentNum = parseFloat(rentMatch[1]);
    } else {
      const yenMatch = html.match(/(\d{1,3}(?:,\d{3})+)\s*円/);
      if (yenMatch) {
        const val = parseInt(yenMatch[1].replace(/,/g, ''), 10);
        rentNum = Math.round((val / 10000) * 10) / 10;
        rentStr = rentNum.toString();
      }
    }

    let mgmtNum = 3000;
    const mgmtMatch = html.match(/(?:管理費|共益費)\s*[:：]?\s*(\d{1,3}(?:,\d{3})*|\d+)\s*円/);
    if (mgmtMatch) {
      mgmtNum = parseInt(mgmtMatch[1].replace(/,/g, ''), 10);
    }

    // 4. Extract Address
    let address = "";
    const addrMatch = html.match(/所在地[:：]?\s*([^\n\r<]{4,35}?[区市町][^\n\r<]{0,20})/) || html.match(/(東京都[^\s<"'/\n\r]+?[区市][^\s<"'/\n\r]*)/);
    if (addrMatch) {
      address = stripHtml(addrMatch[1]).replace(/の周辺.*/, '');
    } else {
      address = "東京都";
    }

    // Ward Name
    let ward = "東京都";
    const wardMatch = address.match(/(?:東京都)?([^市区町村]+?[区市])/);
    if (wardMatch) {
      ward = wardMatch[1];
    }

    // 5. Extract Stations Dynamically
    const stations: StationDetail[] = [];
    const seenStations = new Set<string>();

    // Scan for all station patterns
    const stMatches = html.matchAll(/([^\n\r<>/]{2,15}?[線道])?\s*[/／]?\s*([^\s/<>\n\r]{2,8}?駅)\s*(?:徒歩|歩)?\s*(\d+)分/g);
    for (const match of stMatches) {
      const line = (match[1] || "").replace(/^(?:地下鉄|新交通)\s*/, '').trim();
      const station = match[2].trim();
      const walkMin = parseInt(match[3], 10);
      const key = `${station}_${walkMin}`;

      if (!seenStations.has(key) && stations.length < 3 && !station.includes("利用")) {
        seenStations.add(key);

        let destZh = "通往市區商圈交通便利";
        let destJa = "周辺主要駅へのアクセスが良好";
        let pitZh = "尖峰時刻建議提早出門避開人潮。";
        let pitJa = "混雑時間帯は時間に余裕を持った移動を推奨。";

        if (line.includes("山手線") || station.includes("代々木") || station.includes("新宿")) {
          destZh = "直達 澀谷、新宿、池袋、品川、東京站，首都核心大動脈";
          destJa = "渋谷・新宿・池袋・品川・東京へ直通する都心の大動脈";
          pitZh = "⚠️ 早晚尖峰人潮擁擠，若為大站需留意站內步行距離。";
          pitJa = "⚠️ 朝夕のラッシュ時は混雑注意。大駅は改札内移動時間も要確認。";
        } else if (line.includes("大江戸線") || station.includes("都庁前")) {
          destZh = "直達 六本木、麻布十番、汐留、青山一丁目、飯田橋";
          destJa = "六本木・麻布十番・汐留・青山一丁目方面へ直通";
          pitZh = "⚠️ 大江戶線為大深度地下鐵，月台在地下深層，上下電扶梯需多抓 3~5 分鐘！";
          pitJa = "⚠️ 大江戸線は大深度地下鉄のため、ホームへの上り下りに+3〜5分必要。";
        } else if (line.includes("小田急") || station.includes("南新宿")) {
          destZh = "通往新宿僅 1 站（步行亦可達），直達下北澤、町田、小田原";
          destJa = "新宿へわずか1駅（徒歩圏内）、下北沢・町田方面へ直通";
          pitZh = "⚠️ 各站停車（各停）車站班次間距稍長，部分快車不停靠。";
          pitJa = "⚠️ 各駅停車のみの駅は運行間隔に留意。";
        } else if (line.includes("中央") || line.includes("総武")) {
          destZh = "橫貫東京東西，直達御茶之水、秋葉原、中野、吉祥寺";
          destJa = "御茶ノ水・秋葉原・中野・吉祥寺方面へ東西直結";
          pitZh = "⚠️ 尖峰時刻中野至新宿區間人流密集。";
          pitJa = "⚠️ 平日ラッシュ時は混雑率が高め。";
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

    // 6. Extract Layout & Area Dynamically
    let layoutType = "1K";
    const layoutMatch = html.match(/(?:間取り|間取)[:：]?\s*([1-4][LDRKS]+|[1-4][RDK])/i);
    if (layoutMatch) {
      layoutType = layoutMatch[1].toUpperCase();
    }

    let areaSize = "";
    const areaMatch = html.match(/(\d+(?:\.\d+)?)\s*(?:㎡|平米|m2|m²)/i);
    if (areaMatch) {
      areaSize = `${areaMatch[1]}㎡`;
    }

    let layoutCommentZh = "格局動線分明，空間利用率良好。";
    let layoutCommentJa = "動線が明確で無駄の少ない使いやすい間取りです。";
    let layoutTips: Array<{ zh: string; ja: string }> = [];

    if (layoutType.includes("1R") || layoutType.includes("1K")) {
      layoutCommentZh = `單身貴族主流的 ${layoutType} 格局（${areaSize}）。廚房與臥室分開，打掃輕鬆、冷暖房省電。`;
      layoutCommentJa = `単身者に人気の${layoutType}間取り（${areaSize}）。掃除が楽で光熱費も抑えられます。`;
      layoutTips = [
        { zh: "玄關走道需確認冰箱與洗衣機擺放動線。", ja: "冷蔵庫や洗濯機置き場の寸法確認が重要。" },
        { zh: "單身房型需留意收納空間與衣櫃容量。", ja: "クローゼットや靴箱の収納容量を内見で要確認。" }
      ];
    } else if (layoutType.includes("1DK") || layoutType.includes("1LDK")) {
      layoutCommentZh = `臥房與客餐廳獨立分離的 ${layoutType} 格局（${areaSize}）。生活起居與睡眠空間分開，生活品質高。`;
      layoutCommentJa = `寝食を分離できるゆとりのある${layoutType}間取り（${areaSize}）。快適な居住空間を確保可能。`;
      layoutTips = [
        { zh: "客廳空間寬敞，可配置餐桌與工作書桌。", ja: "LDKにデスクやソファをゆったり配置可能。" },
        { zh: "臥房需丈量床架與衣櫃開合動線。", ja: "寝室のベッドサイズと扉の干渉を事前に確認要。" }
      ];
    } else {
      layoutCommentZh = `空間寬裕的 ${layoutType} 格局（${areaSize}），各房間獨立性強，適合家庭或同居居住。`;
      layoutCommentJa = `各部屋のプライバシーが保たれる${layoutType}間取り（${areaSize}）。二人暮らしやファミリーに最適。`;
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

    // 7. Extract Structure & Age
    let structureStr = "鉄骨造";
    if (html.includes("SRC") || html.includes("鉄骨鉄筋")) structureStr = "SRC造";
    else if (html.includes("RC") || html.includes("鉄筋コンクリート")) structureStr = "RC造";
    else if (html.includes("木造")) structureStr = "木造";

    let ageStr = "築30年";
    const aMatch = html.match(/築\s*(\d+)\s*年/);
    if (aMatch) ageStr = `築${aMatch[1]}年`;

    // 8. Dynamic Ward Pros & Cons
    let wardAnalysis: WardAnalysis;
    if (ward.includes("渋谷区") || address.includes("代々木")) {
      wardAnalysis = {
        wardName: { zh: "東京都 渋谷區（渋谷区）", ja: "東京都 渋谷区" },
        summary: {
          zh: "澀谷區是流行文化、商業創意與高級住宅並存的地區。代代木緊鄰明治神宮與代代木公園，鬧中取靜、治安良好。",
          ja: "渋谷区はトレンドと洗練された住宅街が融合する人気エリア。代々木は明治神宮や代々木公園に隣接し治安も良好。"
        },
        pros: [
          { zh: "【交通極致便利】JR山手線、地鐵與私鐵匯聚，去哪都快。", ja: "【都心アクセス最強】山手線をはじめ多数の路線が利用可能。" },
          { zh: "【大片自然綠意】代代木公園與明治神宮綠意環繞，生活品質高。", ja: "【豊かな自然】代々木公園や明治神宮が身近でリフレッシュに最高。" }
        ],
        cons: [
          { zh: "【房租物價偏高】全東京租金前列，同預算面積較精簡。", ja: "【家賃相場が高め】23区内でも家賃水準がトップクラス。" }
        ]
      };
    } else if (ward.includes("新宿区")) {
      wardAnalysis = {
        wardName: { zh: "東京都 新宿區（新宿区）", ja: "東京都 新宿区" },
        summary: {
          zh: "新宿區是全日本交通樞紐與不夜城中心。西側商務住宅區安靜，東側繁華雜沓。",
          ja: "新宿区はメガターミナルと24時間都市の中心。西側は落ち着き、東側は賑やか。"
        },
        pros: [
          { zh: "【交通樞紐】路線最多，末班車最晚，深夜回家方便。", ja: "【圧倒的交通利便性】終電が遅くまでありタクシー帰宅も容易。" },
          { zh: "【生活機能頂級】各大百貨、電器城與醫院齊全。", ja: "【買い物・医療充実】百貨店や大病院が集積し何でも揃う。" }
        ],
        cons: [
          { zh: "【區域環境落差大】東口歌舞伎町環境嘈雜，需慎選街區。", ja: "【エリア格差】歓楽街周辺は治安や騒音に注意が必要。" }
        ]
      };
    } else {
      wardAnalysis = {
        wardName: { zh: `東京都 ${ward}`, ja: `東京都 ${ward}` },
        summary: {
          zh: `${ward}具備成熟的市區生活基盤，交通與日常機能均衡。`,
          ja: `${ward}は生活基盤が整った暮らしやすいエリアです。`
        },
        pros: [
          { zh: "主要車站通勤便捷，日常採買方便。", ja: "主要駅へのアクセスが良く、日々の買い物も便利。" }
        ],
        cons: [
          { zh: "需留意尖峰通勤擁擠與大馬路車流聲音。", ja: "ラッシュ時の混雑や道路沿いの騒音を事前確認推奨。" }
        ]
      };
    }

    // 9. Famous Chains & Convenience Stores
    const famousChains: FamousChainGroup[] = [
      {
        categoryName: { zh: "🥩 國民牛丼三大龍頭（平價外食）", ja: "🥩 牛丼御三家（お手軽・安価な定番）" },
        chains: [
          {
            name: "すき家（Sukiya）",
            brandType: { zh: "平價牛丼・咖哩", ja: "牛丼・カレー" },
            walk: "徒歩 3〜5 分",
            budget: "約 400〜650 円",
            feature: { zh: "24小時營業，起司牛丼人氣最高，菜單最多最省錢。", ja: "24時間営業。チーズ牛丼など豊富なメニュー。" }
          },
          {
            name: "松屋（Matsuya）",
            brandType: { zh: "牛丼・和風定食", ja: "牛めし・定食" },
            walk: "徒歩 4〜6 分",
            budget: "約 450〜750 円",
            feature: { zh: "內用一律免費附贈熱味噌湯！生薑燒肉與咖哩高CP值。", ja: "店内飲食はみそ汁無料。定食のコスパが高い。" }
          },
          {
            name: "吉野家（Yoshinoya）",
            brandType: { zh: "傳統牛肉丼飯", ja: "牛丼" },
            walk: "徒歩 5〜8 分",
            budget: "約 450〜700 円",
            feature: { zh: "牛肉軟嫩入味，出餐速度全日本最快。", ja: "提供スピード最速。牛肉の旨味が自慢。" }
          }
        ]
      },
      {
        categoryName: { zh: "🍔 平價速食 & 家庭餐廳", ja: "🍔 ファストフード＆ファミレス" },
        chains: [
          {
            name: "マクドナルド（McDonald's）",
            brandType: { zh: "美式速食", ja: "ファストフード" },
            walk: "徒歩 4〜6 分",
            budget: "約 400〜700 円",
            feature: { zh: "百圓黑咖啡與早餐滿福堡，多有插座可辦公。", ja: "100円台コーヒー。コンセント席あり。" }
          },
          {
            name: "サイゼリヤ（Saizeriya）",
            brandType: { zh: "平價義式家常", ja: "激安ファミレス" },
            walk: "徒歩 6〜10 分",
            budget: "約 500〜900 円",
            feature: { zh: "肉醬焗烤飯 300円、葡萄酒 100円，省錢聚餐天花板。", ja: "ミラノ風ドリア300円、ワイン100円の圧倒的安さ。" }
          }
        ]
      },
      {
        categoryName: { zh: "🍜 國民平價拉麵 & 中華", ja: "🍜 ラーメン・中華チェーン" },
        chains: [
          {
            name: "日高屋（Hidakaya）",
            brandType: { zh: "平價熱炒拉麵", ja: "熱烈中華食堂" },
            walk: "徒歩 5〜7 分",
            budget: "約 390〜750 円",
            feature: { zh: "醬油拉麵 390円、煎餃 250円，平價飽足首選。", ja: "中華そば390円、餃子250円の庶民派中華。" }
          }
        ]
      }
    ];

    const convenienceStores: ConvenienceStoreGuide[] = [
      {
        brandName: "まいばすけっと（My Basket / AEON旗下）",
        tier: { zh: "💰 平價省錢型（超商外表・超市價格）", ja: "💰 激安・都市型ミニスーパー" },
        priceLevel: "★☆☆☆☆（比一般超商便宜 30%〜40%！）",
        features: {
          zh: "鮮奶 180 円、便當 350 円！賣的是 AEON 超市價，住處附近有它每月省數千日圓。",
          ja: "見た目はコンビニ、価格はスーパー！牛乳・冷凍食品が3割以上安い。"
        },
        bestFor: { zh: "省錢租屋族、日常補買生鮮牛奶雞蛋", ja: "節約派の一人暮らし、自炊の買い足し" },
        isNearby: true,
        distance: "徒歩 3〜5 分"
      },
      {
        brandName: "セブン-イレブン（7-Eleven）",
        tier: { zh: "⚖️ 標準三大超商（便當熟食王者）", ja: "⚖️ 大手3社・クオリティ絶対王者" },
        priceLevel: "★★★☆☆（公定標價，鮮少折扣）",
        features: {
          zh: "自有品牌 7-Premium 最好吃，炸雞（ななチキ）與便當品質最高，ATM 提款最順暢。",
          ja: "お弁当・揚げ物の質が高く、ATMの利便性も抜群。"
        },
        bestFor: { zh: "追求便當品質、寄件與提款", ja: "味にこだわりたい時、ATM利用" },
        isNearby: true,
        distance: "徒歩 2〜3 分"
      },
      {
        brandName: "ファミリーマート（FamilyMart）",
        tier: { zh: "⚖️ 標準三大超商（炸雞甜點霸主）", ja: "⚖️ 大手3社・ファミチキ＆スイーツ" },
        priceLevel: "★★★☆☆（常有折扣券）",
        features: {
          zh: "國民級美食「全家炸雞（ファミチキ）」多汁必吃，甜點泡芙種類多。",
          ja: "ファミチキが看板商品。スイーツやアパレルも充実。"
        },
        bestFor: { zh: "宵夜吃多汁炸雞、甜點犒賞", ja: "ファミチキ、クーポンでお得に買い物" },
        isNearby: true,
        distance: "徒歩 2〜4 分"
      },
      {
        brandName: "ナチュラルローソン（Natural Lawson）",
        tier: { zh: "💎 高檔精品型（都會有機貴婦風）", ja: "💎 高級・オーガニックコンビニ" },
        priceLevel: "★★★★☆（偏高，比普通超商貴 15%~20%）",
        features: {
          zh: "專開在都心精華區，主打有機蔬果、無添加熟食、進口紅白酒與起司。",
          ja: "無添加・オーガニック食品や焼きたてパンを揃えた大人向け。"
        },
        bestFor: { zh: "注重健康飲食、講究生活品質的小資族", ja: "美容・健康志向、少し贅沢な夜食" },
        isNearby: address.includes("代々木") || address.includes("新宿") || address.includes("渋谷"),
        distance: "徒歩 5〜8 分"
      }
    ];

    // 10. Supermarkets
    let supermarkets: Supermarket[];
    if (address.includes("代々木")) {
      supermarkets = [
        {
          name: "マルマンストア（Maruman Store）南新宿店",
          positioning: { zh: "主力大型綜合生鮮超市", ja: "地域主力・生鮮総合スーパー" },
          rating: "4.0 ★★★★☆",
          walk: "徒歩 3 分",
          hours: "10:00 - 23:00",
          comment: { zh: "生鮮蔬果、肉品與熟食便當齊全，自炊最核心基地。", ja: "生鮮・総菜が充実し自炊派の強い味方。" }
        },
        {
          name: "まいばすけっと 代々木2丁目店",
          positioning: { zh: "平價都會小型超市（AEON旗下）", ja: "イオングループ都市型ミニスーパー" },
          rating: "3.8 ★★★☆☆",
          walk: "徒歩 4 分",
          hours: "07:00 - 24:00",
          comment: { zh: "營業到午夜！牛奶、雞蛋、冷凍食品比超商便宜 30% 以上。", ja: "深夜24時まで営業。価格が手頃で買い足しに最高。" }
        }
      ];
    } else {
      supermarkets = [
        {
          name: "サミット / ライフ等 地域主力スーパー",
          positioning: { zh: "主力大型生鮮超市", ja: "地域主力・大型総合スーパー" },
          rating: "4.1 ★★★★☆",
          walk: "徒歩 5〜7 分",
          hours: "09:00 - 23:00",
          comment: { zh: "肉品、海鮮最齊全，熟食便當多且價格公道，自炊首選。", ja: "生鮮食品・総菜が充実した自炊生活のメインスーパー。" }
        },
        {
          name: "まいばすけっと / マルエツプチ（小型便利超市）",
          positioning: { zh: "都會型平價便利超市", ja: "都市型ミニスーパー" },
          rating: "3.8 ★★★☆☆",
          walk: "徒歩 3〜5 分",
          hours: "深夜まで営業",
          comment: { zh: "營業時間長，半夜補買牛奶雞蛋蔬菜極為便捷。", ja: "深夜の急な買い出しに便利でコンビニより安価。" }
        }
      ];
    }

    // 11. Match Rules
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

    // Initial Cost
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
        { name: { zh: "仲介手續費（約 0.5~1個月）", ja: "仲介手数料（0.5〜1ヶ月）" }, amount: `約 ${(rentNum * 0.55).toFixed(1)}〜${(rentNum * 1.1).toFixed(1)} 万円` },
        { name: { zh: "保證公司初回料（約 50%）", ja: "保証会社利用料（初回約50%）" }, amount: `約 ${(rentNum * 0.5).toFixed(1)} 万円` },
        { name: { zh: "火災保險＋換鎖費用", ja: "火災保険＋鍵交換費用" }, amount: "約 4.0 万円" }
      ]
    };

    // Run Engine
    const evaluation = evaluateProperty(
      Array.from(matchedRuleIds),
      stations,
      wardAnalysis,
      famousChains,
      convenienceStores,
      supermarkets,
      layoutAnalysis,
      undefined, // Remove redundant area text to keep page concise
      initialCost
    );

    const metaParts = [layoutType, areaSize, structureStr, ageStr, address].filter(Boolean);

    return NextResponse.json({
      success: true,
      title: propertyTitle,
      rent: rentStr || "7.2",
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
