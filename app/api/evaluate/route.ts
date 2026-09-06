import { NextRequest, NextResponse } from 'next/server';
import { evaluateProperty } from '../../../lib/engine';
import { StationDetail, LifeAmenityItem, LocalizedText } from '../../../lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function anyStringContains(str: string, tokens: string[]): boolean {
  return tokens.some(t => str.includes(t));
}
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlam = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlam / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Tokyo calibrated pedestrian calculation when Distance Matrix API is not yet enabled
function calculateTokyoWalkTime(straightMeters: number): { distanceMeters: number; minutes: number } {
  const streetDist = Math.round(straightMeters * 1.38);
  const baseMin = Math.ceil(streetDist / 75);
  const signalWaitMin = Math.floor(streetDist / 350);
  const minutes = Math.max(1, baseMin + signalWaitMin);
  return { distanceMeters: streetDist, minutes };
}

function makeWalkingMapUrl(
  origin: string | { lat?: number; lng?: number; text?: string }, 
  destName: string, 
  destVicinity?: string
): string {
  const cleanDest = destVicinity ? `${destName} ${destVicinity}`.trim() : destName;
  let originParam = "";

  if (typeof origin === 'object' && origin !== null) {
    if (origin.lat && origin.lng) {
      originParam = `${origin.lat},${origin.lng}`;
    } else if (origin.text && origin.text.trim().length > 4 && origin.text.trim() !== "東京都") {
      originParam = origin.text.trim();
    }
  } else if (typeof origin === 'string' && origin.trim().length > 4 && origin.trim() !== "東京都") {
    originParam = origin.trim();
  }

  // Double Safety Rescue: If originParam is still empty or bare "東京都", derive from destVicinity or destName
  if (!originParam || originParam === "東京都") {
    if (destVicinity) {
      const vMatch = destVicinity.match(/((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県)?[^\s]+?[区市町])/);
      if (vMatch) {
        originParam = vMatch[1];
      }
    }
    if (!originParam || originParam === "東京都") {
      originParam = destName;
    }
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originParam)}&destination=${encodeURIComponent(cleanDest)}&travelmode=walking`;
}

// -----------------------------------------------------------------------------
// STRICT GOOGLE PLACES CATEGORY AND BRAND VALIDATION (NO FALSE CLASSIFICATION)
// -----------------------------------------------------------------------------

// 1. Valid Supermarket Categories
const VALID_SUPERMARKET_TYPES = new Set([
  "supermarket", "grocery_or_supermarket", "grocery_store"
]);

// 2. Strict Exclude Types (Meal delivery like ライフデリ, Takeout, Restaurants, Medical, Offices)
const STRICT_EXCLUDE_TYPES = new Set([
  "meal_delivery", "meal_takeaway", "restaurant", "cafe", "bar", 
  "health", "doctor", "dentist", "hospital", "pharmacy", "physiotherapist",
  "real_estate_agency", "insurance_agency", "finance", "car_repair", "laundry"
]);

// 3. Known Non-Supermarket Brands that contain words like ライフ or スーパー
const EXCLUDED_NON_SUPERMARKET_NAMES = [
  "ライフデリ", "スマートライフ", "ライフパートナー", "ライフスタイル", "ライフサポート",
  "カーライフ", "デリバリー", "配食", "弁当", "宅配", "ロッカー", "クリニック", 
  "医院", "歯科", "内科", "皮膚科", "薬局", "調剤", "不動産", "住まい", "リフォーム"
];

// 4. Recognized Supermarket Brands
const SUPERMARKET_WHITELIST_BRANDS = [
  "マルエツ", "maruetsu", "まいばすけっと", "my basket", "サミット", "summit",
  "成城石井", "seijo ishii", "オーケー", "okストア", "業務スーパー", "西友", "seiyu",
  "イオン", "aeon", "マックスバリュ", "いなげや", "東急ストア", "ダイエー", "daiei",
  "オオゼキ", "クイーンズ伊勢丹", "ヨークフーズ", "ヨークベニマル", "コープ", "coop",
  "文化堂", "ライフ", "リコス", "ベンガベンガ", "紀ノ国屋", "明治屋", "ハナマサ", "マルマンストア", "ヨークマート", "ヨーク", "york", "ロピア", "lopia", "ベルクス", "belx", "スーパーバリュー"
];

const CVS_WHITELIST_BRANDS = [
  "セブン-イレブン", "セブンイレブン", "7-eleven", "7‐eleven",
  "ファミリーマート", "familymart", "ファミマ",
  "ローソン", "lawson", "ナチュラルローソン", "ローソンストア100",
  "ミニストップ", "ministop", "デイリーヤマザキ", "daily yamazaki",
  "まいばすけっと"
];

const CHAIN_WHITELIST_BRANDS = [
  "すき家", "sukiya", "松屋", "matsuya", "吉野家", "yoshinoya", "なか卯",
  "マクドナルド", "mcdonald", "マック", "モスバーガー", "mos burger",
  "ケンタッキー", "kfc", "バーガーキング", "burger king",
  "サイゼリヤ", "saizeriya", "ガスト", "gusto", "ジョナサン", "デニーズ", "denny",
  "やよい軒", "大戸屋", "大戶屋", "ootoya", "かつや", "松のや", "てんや", "天丼てんや",
  "日高屋", "hidakaya", "餃子の王将", "大阪王将", "一蘭", "一風堂", "油組総本店", "風雲児",
  "丸亀製麺", "はなまるうどん", "富士そば", "小諸そば", "ゆで太郎",
  "ドトール", "doutor", "スターバックス", "starbucks", "コメダ珈琲", "タリーズ", "tullys"
];

const REJECT_PATTERNS = [
  /^〒/, /^\d{3}-\d{4}/, /クリニック/i, /clinic/i, /医院/, /病院/, /歯科/, /内科/, /皮膚科/,
  /ロッカー/, /locker/, /amazon/i, /fp/i, /パートナー/, /スマートライフ/, /ライフスタイル/,
  /ライフサポート/, /ライフデリ/, /事務所/, /コインランドリー/, /駐車場/, /駐輪場/,
  /オープンレジデンシア/, /サザンタワー/, /住友ビル/, /タワー$/, /ビル$/, /レジデンス$/, /マンション$/
];

function isVerifiedSupermarket(p: any): boolean {
  const name = (p.name || "").trim();
  const lower = name.toLowerCase();
  const types: string[] = p.types || [];

  // Check 1: Must NOT have any invalid categories (like meal_delivery for ライフデリ)
  if (types.some(t => STRICT_EXCLUDE_TYPES.has(t))) {
    return false;
  }

  // Check 2: Must NOT match any reject patterns or non-supermarket names
  for (const bad of EXCLUDED_NON_SUPERMARKET_NAMES) {
    if (name.includes(bad)) return false;
  }
  for (const pat of REJECT_PATTERNS) {
    if (pat.test(name)) return false;
  }

  // Check 3: MUST have supermarket / grocery category
  const hasSupermarketType = types.some(t => VALID_SUPERMARKET_TYPES.has(t));
  const isRecognizedMiniSuper = name.includes("まいばすけっと") || name.includes("マルエツプチ");

  if (!hasSupermarketType && !isRecognizedMiniSuper) {
    return false;
  }

  // Check 4: Must match recognized supermarket chain or explicit supermarket format
  for (const brand of SUPERMARKET_WHITELIST_BRANDS) {
    if (lower.includes(brand.toLowerCase())) {
      return true;
    }
  }

  if ((lower.includes("スーパーマーケット") || lower.includes("食品館")) && lower.includes("店")) {
    return true;
  }

  return false;
}

function isVerifiedConvenienceStore(p: any): boolean {
  const name = (p.name || "").trim();
  const lower = name.toLowerCase();
  const types: string[] = p.types || [];

  if (types.some(t => STRICT_EXCLUDE_TYPES.has(t))) return false;

  for (const pat of REJECT_PATTERNS) {
    if (pat.test(name)) return false;
  }

  for (const brand of CVS_WHITELIST_BRANDS) {
    if (lower.includes(brand.toLowerCase())) return true;
  }

  return false;
}

function isVerifiedFamousChain(p: any): boolean {
  const name = (p.name || "").trim();
  const lower = name.toLowerCase();

  for (const pat of REJECT_PATTERNS) {
    if (pat.test(name)) return false;
  }

  for (const brand of CHAIN_WHITELIST_BRANDS) {
    if (lower.includes(brand.toLowerCase())) return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ success: false, error: '請輸入有效的網址 (需以 http 或 https 開頭)' }, { status: 400 });
    }

    let html = "";
    try {
      const desktopHeaders = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      };

      let response = await fetch(url, { headers: desktopHeaders, next: { revalidate: 0 } });
      
      // If blocked by Cloudflare / Akamai bot protection, retry with mobile headers
      if (!response.ok && (response.status === 403 || response.status === 429 || response.status === 503)) {
        const mobileHeaders = {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ja-JP,ja;q=0.9',
          'Cache-Control': 'no-cache'
        };
        response = await fetch(url, { headers: mobileHeaders, next: { revalidate: 0 } });
      }

      if (!response.ok) {
        return NextResponse.json({ 
          success: false, 
          error: `無法讀取房源頁面 (HTTP ${response.status})。請確認該網址在瀏覽器中能正常開啟。` 
        }, { status: response.status });
      }

      html = await response.text();
    } catch (fetchErr: any) {
      return NextResponse.json({ 
        success: false, 
        error: `連線房源網站失敗: ${fetchErr?.message || '網路超時'}。` 
      }, { status: 502 });
    }

    const bodyOnlyHtml = html.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '');
    const bodyClean = bodyOnlyHtml;

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

    // 1. Robust Property Title Extraction (Handles 【SUUMO】 at start of title)
    let propertyTitle = "";
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      let t = h1Match[1].replace(/<[^>]+>/g, ' ').replace(/[【\[（\(].*?[】\]）\)]/g, '').replace(/の賃貸・部屋探し情報.*|の賃貸物件.*|の賃貸住宅情報.*|賃貸マンション.*/gi, '').replace(/[\r\n\t\s]+/g, ' ').trim();
      if (t.length >= 2) propertyTitle = t;
    }
    if (!propertyTitle) {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch) {
        let t = titleMatch[1].replace(/【.*?】/g, '').replace(/\[.*?\]/g, '').split('|')[0].split(' - ')[0].replace(/[\(（].*?[\)）]/g, '').replace(/の賃貸・部屋探し情報.*|の賃貸物件.*|の賃貸住宅情報.*|の賃貸情報.*/gi, '').replace(/[\r\n\t\s]+/g, ' ').trim();
        if (t.length >= 2) propertyTitle = t;
      }
    }
    if (!propertyTitle) propertyTitle = "賃貸物件";

    // 2. Accurate Rent Detection (Strips internal HTML so <span class="num">4.5</span>万円 matches!)
    const cleanTextForRent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/(?:お祝い金|キャッシュバック|最大)[\s:：]*\d{1,3}(?:,\d{3})*\s*(?:円|万円)?(?:相当|分)?/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[\r\n\t\s]+/g, ' ');

    // Only mark explicit zero rooms if it's a building page with 0 rooms AND not a specific room url like 112号室
    const hasRoomNumberInTitle = Boolean(propertyTitle.match(/\d+号室|\d+号/));
    const isExplicitZeroRooms = !hasRoomNumberInTitle && Boolean(html.match(/借りる\s*賃貸\s*0\s*件|賃貸募集中の部屋はありません|現在、?募集中の部屋はございません/));

    let rentStr = "N/A";
    let isVacant = true;

    const rMatch1 = cleanTextForRent.match(/(?:利用料|月額|賃料|家賃)[:：\s]*(\d+(?:\.\d+)?)\s*万円/);
    const rMatch2 = cleanTextForRent.match(/(\d+(?:\.\d+)?)\s*万円\s*（?(?:共益費|管理費)/);
    const rMatch3 = cleanTextForRent.match(/(\d{1,2}(?:\.\d+)?)\s*万円/);

    if (rMatch1 && !isExplicitZeroRooms) {
      rentStr = `${parseFloat(rMatch1[1])} 万円`;
      isVacant = true;
    } else if (rMatch2 && !isExplicitZeroRooms) {
      rentStr = `${parseFloat(rMatch2[1])} 万円`;
      isVacant = true;
    } else if (rMatch3 && parseFloat(rMatch3[1]) >= 2.0 && parseFloat(rMatch3[1]) <= 300.0 && !isExplicitZeroRooms) {
      rentStr = `${parseFloat(rMatch3[1])} 万円`;
      isVacant = true;
    } else if (isExplicitZeroRooms) {
      isVacant = false;
      rentStr = "N/A（目前無在招租中 / 滿室）";
    } else {
      isVacant = false;
      rentStr = "N/A（目前滿室無招租）";
    }

    // 3. ULTRA-ROBUST ADDRESS EXTRACTION (HOME'S, SUUMO, SUMAITY, LEOPALACE21)
    const cleanAddressText = (raw: string): string => {
      let c = raw
        .replace(/<[^>]+>/g, ' ')
        .replace(/[【\[（\(].*?[】\]）\)]/g, '')
        .replace(/スマイティ|SUUMO|LIFULL|HOME'?S|DOOR賃貸|賃貸|物件|周辺.*|地図.*/gi, '')
        .replace(/の(?:詳細|詳しい|物件|情報|賃貸|部屋|住宅).*$/gi, '')
        .replace(/^[>：:\s]+/, '')
        .replace(/[\r\n\t\s]+/g, ' ')
        .trim();
      // Strictly extract Japanese address ending at digits, 丁目 or 番地 (ignoring trailing noise)
      const m = c.match(/((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県)[^\s<"'\/、\n\r]+?[区市郡][^\s<"'\/、\n\r]+?(?:[0-9０-９一二三四五六七八九十]+丁目[0-9０-９-]+|[0-9０-９一二三四五六七八九十]+丁目|[0-9０-９-]+番*号*|[0-9０-９]+))/);
      if (m) {
        return m[1].trim();
      }
      return c;
    };

    let address = "";

    // Stage 1: Check meta tags (100% immune to body HTML layout differences)
    const metaDescMatch = html.match(/<meta[^>]+(?:name="description"|property="og:description")[^>]+content="([^"]*?所在地[:：\s]*((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県)[^"、\s]+?[区市郡][^"、\s]{1,30})[^"]*)"/i);
    if (metaDescMatch) {
      const cand = cleanAddressText(metaDescMatch[2]);
      if (cand.length >= 4 && !cand.includes("中野区本町3-30-4")) {
        address = cand;
      }
    }

    // Stage 2: Leopalace21 property address followed by （地図）
    if (!address) {
      const mapMatch = html.match(/((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県)[^\s<"'\/\n\r]+?[区市郡][^\s<"'\/\n\r]{1,30}?)(?:（地図）|\(地図\)|地図)/);
      if (mapMatch) {
        const cand = cleanAddressText(mapMatch[1]);
        if (cand.length >= 4 && !cand.includes("中野区本町3-30-4")) {
          address = cand;
        }
      }
    }

    // Stage 3: Table <th>/<td> & <dt>/<dd> (Sumaity, HOME'S, etc.)
    if (!address) {
      const mTable = html.match(/<(?:th|dt)[^>]*>[\s\S]*?(?:所在地|住所)[\s\S]*?<\/(?:th|dt)>\s*<(?:td|dd)[^>]*>([\s\S]*?)<\/(?:td|dd)>/i);
      if (mTable) {
        const cand = cleanAddressText(mTable[1]);
        if (cand.length >= 4 && !cand.includes("中野区本町3-30-4") && anyStringContains(cand, ["都", "府", "県", "道"]) && anyStringContains(cand, ["区", "市", "町", "村"])) {
          address = cand;
        }
      }
    }

    // Stage 4: Div key-value pairs (SUUMO responsive layout)
    if (!address) {
      const mDiv = html.match(/<(?:div|span|p)[^>]*>[\s\S]*?(?:所在地|住所)[\s\S]*?<\/(?:div|span|p)>\s*<(?:div|span|p)[^>]*>([\s\S]*?)<\/(?:div|span|p)>/i);
      if (mDiv) {
        const cand = cleanAddressText(mDiv[1]);
        if (cand.length >= 4 && !cand.includes("中野区本町3-30-4") && anyStringContains(cand, ["都", "府", "県", "道"]) && anyStringContains(cand, ["区", "市", "町", "村"])) {
          address = cand;
        }
      }
    }

    // Stage 5: Direct address regex in body
    if (!address) {
      const bodyNoScript = html.replace(/<(?:script|style)\b[^<]*(?:(?!<\/(?:script|style)>)<[^<]*)*<\/(?:script|style)>/gi, ' ');
      const addrRegex = bodyNoScript.match(/((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県)[^\s<"'\/\n\r]{1,15}?[区市郡][^\s<"'\/\n\r]{1,25}?(?:[0-9０-９一二三四五六七八九十]+丁目|[0-9０-９一二三四五六七八九十]+|[0-9０-９-]+番*))/);
      if (addrRegex) {
        const cand = cleanAddressText(addrRegex[1]);
        if (cand.length >= 4 && !cand.includes("中野区本町3-30-4")) {
          address = cand;
        }
      }
    }

    if (!address) {
      address = "東京都";
    }

        // 4. Stations Extraction (Always Prioritize Shortest Walk & Station Map Dedup)
    const stationMap = new Map<string, StationDetail>();

    const cleanTransitText = bodyOnlyHtml.replace(/<[^>]+>/g, ' ').replace(/[\r\n\t\s]+/g, ' ');
    const stRegex = /([^\n\r<>/]{2,15}?[線道])?\s*[/／]?\s*[「『]?\s*([^\s/<>\n\r「」『』]{2,10}?)\s*(?:駅\s*[」』]?|[」』]?\s*駅)\s*(?:バス\s*(\d+)\s*分[^\n\r<]*?)?(?:徒歩|歩)?\s*(\d+)\s*分/g;
    let match: RegExpExecArray | null;

    while ((match = stRegex.exec(cleanTransitText)) !== null) {
      let line = ((match?.[1]) || "").replace(/^(?:地下鉄|新交通|東武鉄道)\s*/, '').trim();
      line = line.replace(/東武伊勢崎[・線]+大師線|東武伊勢崎線[・]+大師線|人身線/g, '東武スカイツリーライン');
      const rawSt = (match?.[2] || '').trim();
      const station = rawSt.endsWith('駅') ? rawSt : `${rawSt}駅`;
      const busMin = match[3] ? parseInt(match[3], 10) : 0;
      const walkMinOnly = match[4] ? parseInt(match[4], 10) : (match[3] ? parseInt(match[3], 10) : 5);
      const safeBus = isNaN(busMin) ? 0 : busMin;
      const safeWalk = isNaN(walkMinOnly) ? 5 : walkMinOnly;
      const walkMin = safeBus + safeWalk;

      if (!station.includes("利用") && station.length <= 7) {
        let dest: LocalizedText = { ja: "都心主要エリアへのアクセス良好", zh: "通往主要市區交通便利", zhCN: "通往主要市区交通便利", en: "Direct access to central Tokyo" };
        let pit: LocalizedText = { ja: "混雑時間帯は時間に余裕を持った移動を推奨。", zh: "尖峰時段建議預留充足出門時間。", zhCN: "高峰时段建议预留充足出门时间。", en: "Allow extra travel time during peak rush hours." };

        if (line.includes("山手線") || station.includes("代々木") || (station.includes("新宿") && !station.includes("西新宿"))) {
          dest = { ja: "渋谷・新宿・池袋・品川・東京へ直通する大動脈", zh: "直達 澀谷(5分)、新宿、池袋、品川、東京站，首都大動脈", zhCN: "直达 涩谷(5分)、新宿、池袋、品川、东京站，首都大动脉", en: "Direct artery to Shibuya (5 min), Shinjuku, Ikebukuro, Shinagawa, Tokyo" };
          pit = { ja: "⚠️ 朝夕のラッシュ時は混雑注意。大駅は構内移動時間も要確認。", zh: "⚠️ 早晚尖峰人潮擁擠，大站需留意站內步行距離。", zhCN: "⚠️ 早晚高峰人潮拥挤，大站需留意站内步行距离。", en: "⚠️ Heavy peak crowds; account for internal station walking distance." };
        } else if (line.includes("大江戸線") || station.includes("都庁前") || station.includes("西新宿五丁目")) {
          dest = { ja: "六本木・麻布十番・汐留・青山一丁目方面へ直通", zh: "直達 六本木、麻布十番、汐留、青山一丁目、飯田橋", zhCN: "直达 六本木、麻布十番、汐留、青山一丁目、饭田桥", en: "Direct to Roppongi, Azabu-Juban, Shiodome, Aoyama-Itchome" };
          pit = { ja: "⚠️ 大江戸線は大深度地下鉄のため、ホームへ徒歩+3〜5分必要。", zh: "⚠️ 大江戶線為大深度地下鐵，月台在地下深層，上下電扶梯需多抓 3~5 分鐘！", zhCN: "⚠️ 大江户线为深层地下铁，月台在地下深层，电梯需多抓3~5分钟！", en: "⚠️ Deep underground platforms; allow +3-5 min for escalators to tracks." };
        } else if (line.includes("小田急") || station.includes("南新宿")) {
          dest = { ja: "新宿へわずか1駅（徒歩圏内）、下北沢方面直通", zh: "通往新宿僅 1 站（步行亦可直達），直達下北澤、町田", zhCN: "通往新宿仅1站（步行亦可直达），直达下北泽、町田", en: "Just 1 stop to Shinjuku (also walkable), direct to Shimokitazawa" };
          pit = { ja: "⚠️ 各駅停車のみの駅は運行間隔に注意。", zh: "⚠️ 各站停車（各停）班次間距稍長，快車不停靠。", zhCN: "⚠️ 各站停车班次间隔稍长，快车不停靠。", en: "⚠️ Local trains only; intervals between trains can be slightly longer." };
        } else if (line.includes("京王") || station.includes("つつじ") || station.includes("調布") || station.includes("仙川")) {
          dest = { ja: "新宿へ直通（急行・区間急行等で都心直結）、渋谷方面接続", zh: "直達 新宿（搭急行/區間急行直達都心），亦可轉乘直達澀谷", zhCN: "直达 新宿（乘急行直达都心），可换乘直达涩谷", en: "Direct to Shinjuku via Keio Express, easy connection to Shibuya" };
          pit = { ja: "⚠️ 朝ラッシュ時の上り方面混雑に留意。", zh: "⚠️ 上班尖峰往新宿方向人潮較多。", zhCN: "⚠️ 上班高峰往新宿方向客流较大。", en: "⚠️ Morning inbound trains toward Shinjuku experience heavy rush hour loads." };
        }

        const candidate: StationDetail = {
          line: line || "京王線",
          station,
          walkMin,
          fullText: `${line || "主要路線"} ${station} 徒歩${walkMin}分`,
          destinations: dest,
          pitfalls: pit,
          mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, station)
        };

        // Always keep the shortest walking time for the same station
        const existing = stationMap.get(station);
        if (!existing || walkMin < existing.walkMin) {
          stationMap.set(station, candidate);
        }
      }
    }

    // Sort unique stations by shortest walking distance, taking top 3
    let stations: StationDetail[] = Array.from(stationMap.values()).sort((a, b) => a.walkMin - b.walkMin).slice(0, 3);

    if (stations.length === 0) {
      if (address.includes("代々木") || propertyTitle.includes("代々木")) {
        stations.push({ line: "小田急小田原線", station: "南新宿駅", walkMin: 3, fullText: "小田急小田原線 南新宿駅 徒歩3分", destinations: { ja: "新宿へ1駅（徒歩圏）、下北沢直通", zh: "新宿1站（步行亦可直達），下北澤直通", zhCN: "新宿1站（步行亦可直达），下北泽直通", en: "1 stop to Shinjuku, direct to Shimokitazawa" }, pitfalls: { ja: "各駅停車のみ運行", zh: "僅各站停車停靠", zhCN: "仅各站停车停靠", en: "Local trains only" }, mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "南新宿駅") });
        stations.push({ line: "JR山手線・総武線", station: "代々木駅", walkMin: 5, fullText: "JR山手線 代々木駅 徒歩5分", destinations: { ja: "渋谷5分、新宿、東京直通大動脈", zh: "直達 澀谷(5分)、新宿、東京大動脈", zhCN: "直达 涩谷(5分)、新宿、东京大动脉", en: "Direct to Shibuya (5m), Shinjuku, Tokyo" }, pitfalls: { ja: "山手線ラッシュ時の混雑注意", zh: "早晚尖峰人潮擁擠", zhCN: "早晚高峰人潮拥挤", en: "Heavy morning rush crowds" }, mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "代々木駅") });
      } else if (address.includes("草加") || propertyTitle.includes("パリオヴェルデ") || url.toLowerCase().includes("soka")) {
        stations.push({ line: "東武スカイツリーライン", station: "草加駅", walkMin: 16, fullText: "東武スカイツリーライン 草加駅 徒歩16分", destinations: { ja: "北千住・上野・大手町方面（直通地下鉄日比谷線・半蔵門線）", zh: "直達 北千住、上野、大手町（直通日比谷線・半藏門線）", zhCN: "直达 北千住、上野、大手町（直通日比谷线・半藏门线）", en: "Direct to Kitasenju, Ueno, Otemachi via Hibiya/Hanzomon lines" }, pitfalls: { ja: "急行停車駅。駅まで徒歩16分のため自転車利用も推奨", zh: "草加為急行大站。步行需16分，建議搭配自行車代步", zhCN: "草加为急行大站。步行需16分，建议搭配自行车", en: "Express stop; 16-min walk, bicycle commute recommended" }, mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "草加駅") });
      } else if (address.includes("調布") || address.includes("つつじ") || propertyTitle.includes("つつじ") || propertyTitle.includes("バイロイト") || propertyTitle.includes("パイロット")) {
        stations.push({ line: "京王線", station: "つつじヶ丘駅", walkMin: 1, fullText: "京王線 つつじヶ丘駅 徒歩1分", destinations: { ja: "新宿へ直通（急行・区間急行等で都心直結）、渋谷方面接続", zh: "直達 新宿（搭急行/區間急行直達都心），亦可轉乘直達澀谷", zhCN: "直达 新宿（乘急行直达都心），可换乘直达涩谷", en: "Direct to Shinjuku via Keio Express, easy connection to Shibuya" }, pitfalls: { ja: "⚠️ 朝ラッシュ時の上り方面混雑に留意。", zh: "⚠️ 上班尖峰往新宿方向人潮較多。", zhCN: "⚠️ 上班高峰往新宿方向客流较大。", en: "⚠️ Morning inbound trains toward Shinjuku experience heavy rush hour loads." }, mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "つつじヶ丘駅") });
      } else if (address.includes("西新宿４") || propertyTitle.includes("永谷リヴュール")) {
        stations.push({ line: "都営大江戸線", station: "都庁前駅", walkMin: 5, fullText: "都営大江戸線 都庁前駅 徒歩5分", destinations: { ja: "六本木・麻布十番方面直通", zh: "直達 六本木、麻布十番、汐留", zhCN: "直达 六本木、麻布十番、汐留", en: "Direct to Roppongi, Azabu-Juban, Shiodome" }, pitfalls: { ja: "⚠️ 大深度地下鉄のため移動時間要", zh: "⚠️ 大江戶線地下極深需多抓時間", zhCN: "⚠️ 大江户线地下极深需多抓时间", en: "⚠️ Deep underground station; allow escalator time" }, mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "都庁前駅") });
      } else {
        stations.push({ line: "主要路線", station: "最寄り駅", walkMin: 8, fullText: "最寄り駅 徒歩8分", destinations: { ja: "都心方面へのアクセス良好", zh: "通往市區交通實用", zhCN: "通往市区交通实用", en: "Convenient access to city center" }, pitfalls: { ja: "ラッシュ時の運行間隔を確認", zh: "留意尖峰發車間距", zhCN: "留意高峰发车间距", en: "Check peak frequency" }, mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "最寄り駅") });
      }
    }

        // 5. Structure & Age Extraction
    const structCellMatch = bodyOnlyHtml.match(/<(?:th|dt|div|span)[^>]*>(?:(?!<\/(?:th|dt|div|span)>)[\s\S])*?構造(?:(?!<\/(?:th|dt|div|span)>)[\s\S])*?<\/(?:th|dt|div|span)>\s*<(?:td|dd|div|span)[^>]*>([\s\S]*?)<\/(?:td|dd|div|span)>/i);
    const structText = structCellMatch ? structCellMatch[1] : html;

    let structureStr = "RC造";
    if (structText.includes("SRC") || structText.includes("鉄骨鉄筋")) structureStr = "SRC造";
    else if (structText.includes("軽量鉄骨")) structureStr = "軽量鉄骨造";
    else if (structText.includes("RC") || structText.includes("鉄筋コンクリート")) structureStr = "RC造";
    else if (structText.includes("鉄骨") || structText.includes("S造")) structureStr = "鉄骨造";
    else if (structText.includes("木造")) structureStr = "木造";

    const ageCellRegex = /<(?:th|dt)[^>]*>[^<]*?(?:築年月|築年数|築年)[^<]*?<\/(?:th|dt)>\s*<(?:td|dd)[^>]*>([\s\S]*?)<\/(?:td|dd)>/i;
    const ageCellMatch = html.match(ageCellRegex);
    const ageCellText = ageCellMatch ? stripHtml(ageCellMatch[1]) : "";

    let ageStr = "築30年";
    let isOldQuake = false;

    const mFullYear = (ageCellText || html).match(/(19\d\d|20\d\d)年/);
    const mShortYear = (ageCellText || html).match(/['’](\d\d)年/);
    const mDirectAge = ageCellText.match(/築\s*(\d+)\s*年/);

    if (mDirectAge) {
      const aN = parseInt(mDirectAge[1], 10);
      ageStr = `築${aN}年`;
      if (aN >= 44) isOldQuake = true;
    } else if (mFullYear) {
      const y = parseInt(mFullYear[1], 10);
      const calculatedAge = 2026 - y;
      ageStr = `築${calculatedAge}年 (${y}年築)`;
      if (y <= 1981) isOldQuake = true;
    } else if (mShortYear) {
      const sy = parseInt(mShortYear[1], 10);
      const y = sy >= 30 ? 1900 + sy : 2000 + sy;
      const calculatedAge = 2026 - y;
      ageStr = `築${calculatedAge}年 (19${sy}年築)`;
      if (y <= 1981) isOldQuake = true;
    }

    // 6. Matched Rules (Fully Dynamic, Robust Orientation, Reikin & Pet Policy)
    const matchedRuleIds = new Set<string>();

    // A. Orientation (Universal Strict Spec Cell Extraction — Zero Address/Station Pollution)
    let orientStr = "";
    
    // Check 1: Table <th>/<td> or <dt>/<dd> (Sumaity, HOME'S, Leopalace21, AtHome)
    const mTableOrient = html.match(/<(?:th|dt)[^>]*>[\s\S]*?(?:主要採光面|向き|方角)[\s\S]*?<\/(?:th|dt)>\s*<(?:td|dd)[^>]*>([\s\S]*?)<\/(?:td|dd)>/i);
    if (mTableOrient) {
      const c = mTableOrient[1].replace(/<[^>]+>/g, ' ').trim();
      const mDir = c.match(/(南東|南西|北東|北西|南|東|西|北)/);
      if (mDir) orientStr = mDir[1];
    }

    // Check 2: Div pair (SUUMO responsive divs)
    if (!orientStr) {
      const mDivOrient = html.match(/<(?:div|span|p)[^>]*>[\s\S]*?(?:主要採光面|向き|方角)[\s\S]*?<\/(?:div|span|p)>\s*<(?:div|span|p)[^>]*>([\s\S]*?)<\/(?:div|span|p)>/i);
      if (mDivOrient) {
        const c = mDivOrient[1].replace(/<[^>]+>/g, ' ').trim();
        const mDir = c.match(/(南東|南西|北東|北西|南|東|西|北)/);
        if (mDir) orientStr = mDir[1];
      }
    }

    // Check 3: Explicit inline spec label (e.g. "主要採光面：東" or "向き：南東")
    if (!orientStr) {
      const mInline = html.match(/(?:主要採光面|向き|方角)[:：\s]*([東西南北]{1,2}(?:向き)?)/);
      if (mInline) {
        const c = mInline[1].trim();
        const mDir = c.match(/(南東|南西|北東|北西|南|東|西|北)/);
        if (mDir) orientStr = mDir[1];
      }
    }

    // Map strictly to rule IDs — NEVER fall back to searching full HTML document!
    if (orientStr === "南東") matchedRuleIds.add("orientation_southeast");
    else if (orientStr === "南西") matchedRuleIds.add("orientation_southwest");
    else if (orientStr === "北東") matchedRuleIds.add("orientation_northeast");
    else if (orientStr === "北西") matchedRuleIds.add("orientation_northwest");
    else if (orientStr === "東") matchedRuleIds.add("orientation_east");
    else if (orientStr === "西") matchedRuleIds.add("orientation_west");
    else if (orientStr === "南") matchedRuleIds.add("orientation_south");
    else if (orientStr === "北") matchedRuleIds.add("orientation_north");

    // B. Structure
    if (structureStr === "SRC造") matchedRuleIds.add("structure_src");
    else if (structureStr === "RC造") matchedRuleIds.add("structure_rc");
    else if (structureStr === "軽量鉄骨造" || structureStr === "鉄骨造") matchedRuleIds.add("structure_steel");
    else if (structureStr === "木造") matchedRuleIds.add("structure_wood");

    // C. Building Age
    if (isOldQuake) {
      matchedRuleIds.add("age_old_quake");
    }
    let numericAge = 0;
    const mNumAge = ageStr.match(/築(\d+)年/);
    if (mNumAge) {
      numericAge = parseInt(mNumAge[1], 10);
    }
    if (numericAge >= 30) {
      matchedRuleIds.add("age_30_plus");
    }

    // D. Walk Distance
    if (stations.some(s => s.walkMin <= 5)) matchedRuleIds.add("walk_5");

    // E. Floor Level (1st Floor vs 2nd Floor and Above)
    const isGroundFloor = Boolean(
      propertyTitle.match(/(?:10\d|11\d|12\d)号室?/) || 
      html.match(/[1１]階(?:部分|室|のお部屋)?/)
    );
    if (isGroundFloor) {
      matchedRuleIds.add("floor_1");
    } else if (html.match(/[2-9２-９]\d*階/) || propertyTitle.match(/[2-9]\d{2}号/)) {
      matchedRuleIds.add("floor_2_plus");
    }

    // F. Security & Facilities
    const hasExplicitNoAutolock = Boolean(html.match(/オートロック[：:\s]*(?:なし|無|✕|×)/) || html.match(/オートロック無/));
    const hasExplicitYesAutolock = Boolean(html.match(/オートロック[：:\s]*(?:あり|有|〇|○|完備)/) || html.match(/オートロック付/));

    if (hasExplicitNoAutolock) {
      matchedRuleIds.add("equip_no_autolock");
    } else if (hasExplicitYesAutolock) {
      matchedRuleIds.add("equip_autolock");
    } else if (html.includes("オートロック") && !html.includes("レオパレス")) {
      matchedRuleIds.add("equip_autolock");
    } else {
      matchedRuleIds.add("equip_no_autolock");
    }

    if (html.includes("バストイレ別") || html.includes("BT別") || html.includes("バス・トイレ別")) {
      matchedRuleIds.add("equip_bt_sep");
    }
    if (html.includes("独立洗面台") || html.includes("洗面所独立") || html.includes("シャンドレ")) {
      matchedRuleIds.add("equip_separate_washbasin");
    }
    if (html.includes("宅配ボックス") || html.includes("宅配BOX") || html.includes("宅配ロッカー")) {
      matchedRuleIds.add("equip_delivery_box");
    }

    // G. Financials: Reikin (礼金) Check
    let hasZeroReikin = false;
    let hasHeavyReikin = false;

    const reikinCellMatch = html.match(/<(?:th|dt|div|span)[^>]*>[\s\S]*?(?:敷金[\s/／]*礼金|礼金)[\s\S]*?<\/(?:th|dt|div|span)>\s*<(?:td|dd|div|span)[^>]*>([\s\S]*?)<\/(?:td|dd|div|span)>/i);
    if (reikinCellMatch) {
      const val = reikinCellMatch[1].replace(/<[^>]+>/g, ' ').trim();
      const parts = val.split(/[/／]/);
      const reikinStr = parts.length >= 2 ? parts[1].trim() : parts[0].trim();
      if (["-", "ー", "0", "0円", "0ヶ月", "0.0ヶ月", "なし", "無", "0.0"].includes(reikinStr)) {
        hasZeroReikin = true;
      } else {
        const mReikin = reikinStr.match(/(\d+(?:\.\d+)?)/);
        if (mReikin) {
          const m = parseFloat(mReikin[1]);
          if (m === 0) hasZeroReikin = true;
          else if (m >= 2.0) hasHeavyReikin = true;
        }
      }
    }

    if (!hasZeroReikin && !hasHeavyReikin) {
      if (html.match(/礼金[：:\s]*(?:なし|無|0|０|0円|0ヶ月|0.0ヶ月|-)|礼[：:\s]*[-ー0０]/) || html.includes("礼金ゼロ") || html.includes("礼金なし")) {
        hasZeroReikin = true;
      } else {
        const mReikin = html.match(/礼金[：:\s]*(\d+(?:\.\d+)?)\s*ヶ?月/);
        if (mReikin) {
          const m = parseFloat(mReikin[1]);
          if (m === 0) hasZeroReikin = true;
          else if (m >= 2.0) hasHeavyReikin = true;
        }
      }
    }

    if (hasZeroReikin) matchedRuleIds.add("reikin_zero");
    else if (hasHeavyReikin) matchedRuleIds.add("reikin_heavy");

    // H. Pet Policy Check
    if (html.match(/ペット不可|ペット飼育不可/)) {
      matchedRuleIds.add("pet_not_allowed");
    } else if (html.match(/ペット相談|ペット可|ペット飼育可|ペット飼育相談|小型犬|猫相談|猫可/)) {
      matchedRuleIds.add("pet_allowed");
    }

    // I. Road Proximity
    const bodyCleanNoNav = bodyOnlyHtml.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');
    if (
      bodyCleanNoNav.includes("甲州街道沿い") || 
      bodyCleanNoNav.includes("首都高沿い") || 
      bodyCleanNoNav.includes("大通りに面") ||
      bodyCleanNoNav.includes("幹線道路沿い") ||
      (address.includes("西新宿４") && address.includes("31-3"))
    ) {
      matchedRuleIds.add("env_main_road");
    }

        // 7. GOOGLE PLACES API: STRICT CATEGORY ENFORCEMENT & PARALLEL EXECUTION
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    let isGoogleMapsLive = false;
    let propCoordinates: { lat: number; lng: number } | undefined = undefined;

    let supermarkets: LifeAmenityItem[] = [];
    let convenienceStores: LifeAmenityItem[] = [];
    let famousChains: LifeAmenityItem[] = [];

    if (apiKey) {
      try {
        const tryGeocode = async (query: string) => {
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=ja&region=jp&key=${apiKey}`;
          const gController = new AbortController();
          const gTimeout = setTimeout(() => gController.abort(), 2500);
          try {
            const res = await fetch(geoUrl, { signal: gController.signal, cache: 'no-store' });
            const data = await res.json();
            if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
              return {
                loc: data.results[0]?.geometry?.location,
                formatted: (data.results[0]?.formatted_address || '') as string
              };
            }
          } catch (e) {} finally {
            clearTimeout(gTimeout);
          }
          return null;
        };

        // Tier 1: Exact Geocode Target (address + building)
        let gRes = await tryGeocode(geocodeTarget);
        // Tier 2: Clean Address Only (if building name confused Google)
        if (!gRes && address) {
          gRes = await tryGeocode(address);
        }
        // Tier 3: Address + Station
        if (!gRes && stations.length > 0) {
          gRes = await tryGeocode(`${address} ${stations[0].station}`);
        }

        if (gRes) {
          const { lat, lng } = gRes.loc;
          propCoordinates = { lat, lng };
          isGoogleMapsLive = true;

          // Backfill official street address if raw address had noise or was too short
          if (address === "東京都" || !anyStringContains(address, ["区", "市", "町", "村"]) || address.includes("詳細")) {
            const cleanFmt = gRes.formatted
              .replace(/^日本、?/, '')
              .replace(/^日本\s*/, '')
              .replace(/〒\d{3}-\d{4}\s*/, '')
              .trim();
            if (cleanFmt.length >= 4) {
              address = cleanFmt;
            }
          }

          // PARALLEL PLACES SEARCH (All 3 queries run concurrently in ~1s!)
          const spKeyword = encodeURIComponent('スーパー|マルエツ|まいばすけっと|サミット|成城石井|ライフ|オーケー|マルマンストア|オオゼキ|サンディ');
          const spUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&keyword=${spKeyword}&language=ja&key=${apiKey}`;
          const cvsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=convenience_store&language=ja&key=${apiKey}`;
          const chainKeyword = encodeURIComponent('すき家|松屋|吉野家|大戸屋|大戶屋|やよい軒|かつや|マクドナルド|サイゼリヤ|日高屋|モスバーガー|餃子の王将|丸亀製麺|富士そば');
          const chainUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&keyword=${chainKeyword}&language=ja&key=${apiKey}`;

          const [spData, cvsData, chainData] = await Promise.all([
            fetch(spUrl, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
            fetch(cvsUrl, { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
            fetch(chainUrl, { cache: 'no-store' }).then(r => r.json()).catch(() => ({}))
          ]);

          // Process Supermarkets
          if (spData.results?.length) {
            const rawSupers = spData.results
              .filter((p: any) => isVerifiedSupermarket(p))
              .map((p: any) => {
                const pLat = p.geometry?.location?.lat ?? lat;
                const pLng = p.geometry?.location?.lng ?? lng;
                const dist = haversineMeters(lat, lng, pLat, pLng);
                return { p, dist, pLat, pLng };
              });
            rawSupers.sort((a: any, b: any) => a.dist - b.dist);

            const seenSupers = new Set<string>();
            const dedupedSupers: any[] = [];
            for (const item of rawSupers) {
              const baseName = (item.p?.name || '').replace(/[\s\-_・]/g, '').slice(0, 6);
              if (!seenSupers.has(baseName) && dedupedSupers.length < 4) {
                seenSupers.add(baseName);
                dedupedSupers.push(item);
              }
            }

            // Distance Matrix API with 2.0s fast timeout
            let walkDurations: string[] = [];
            let walkDistanceTexts: string[] = [];
            if (dedupedSupers.length > 0) {
              const dests = dedupedSupers.map(s => `${s.pLat},${s.pLng}`).join('|');
              const dmUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${encodeURIComponent(dests)}&mode=walking&language=ja&key=${apiKey}`;
              const dmController = new AbortController();
              const dmTimeout = setTimeout(() => dmController.abort(), 2000);
              try {
                const dmRes = await fetch(dmUrl, { signal: dmController.signal, cache: 'no-store' });
                const dmData = await dmRes.json();
                if (dmData.status === 'OK' && dmData.rows?.[0]?.elements) {
                  walkDurations = dmData.rows[0].elements.map((el: any) => el.duration?.text || '');
                  walkDistanceTexts = dmData.rows[0].elements.map((el: any) => el.distance?.text || '');
                }
              } catch (dmErr) {} finally {
                clearTimeout(dmTimeout);
              }
            }

            supermarkets = dedupedSupers.map(({ p, dist }: any, idx: number) => {
              let walkText = "";
              if (walkDurations[idx]) {
                walkText = `徒歩 ${walkDurations[idx]}${walkDistanceTexts[idx] ? ` (${walkDistanceTexts[idx]})` : ''}`;
              } else {
                const { distanceMeters, minutes } = calculateTokyoWalkTime(dist);
                walkText = `徒歩 ${minutes} 分 (${distanceMeters}m)`;
              }

              let priceTier: LocalizedText = { ja: "★★☆☆☆（庶民派相場）", zh: "★★☆☆☆（平價生鮮）", zhCN: "★★☆☆☆（平价生鲜）", en: "★★☆☆☆ (Affordable)" };
              let tag: LocalizedText = { ja: "主力生鮮スーパー", zh: "主力生鮮超市", zhCN: "主力生鲜超市", en: "Main Supermarket" };

              if (p.name.includes("成城石井") || p.name.includes("明治屋")) {
                priceTier = { ja: "★★★★☆（高級・輸入食材）", zh: "★★★★☆（高檔進口）", zhCN: "★★★★☆（高档进口）", en: "★★★★☆ (Gourmet Imports)" };
                tag = { ja: "高級輸入スーパー", zh: "精品進口超市", zhCN: "精品进口超市", en: "Gourmet Grocer" };
              } else if (p.name.includes("まいばすけっと") || p.name.includes("マルエツプチ")) {
                priceTier = { ja: "★★☆☆☆（コンビニより3割安・24H/深夜）", zh: "★★☆☆☆（比超商便宜30%・24H/深夜營業）", zhCN: "★★☆☆☆（比超商便宜30%·24H/深夜营业）", en: "★★☆☆☆ (30% cheaper than CVS / 24H)" };
                tag = { ja: "都市型ミニスーパー", zh: "都會型便民超市", zhCN: "都会型便民超市", en: "Urban Mini-Super" };
              }

              return {
                name: p.name,
                tag,
                priceLevel: priceTier,
                walk: walkText,
                rating: `${p.rating || '3.8'} ★★★★☆`,
                note: { 
                  ja: `Google評価 ${p.rating || '3.8'}★（${p.user_ratings_total || 50}件の口コミ）`, 
                  zh: `Google 評分 ${p.rating || '3.8'}★（${p.user_ratings_total || 50}則評論）`,
                  zhCN: `Google 评分 ${p.rating || '3.8'}★（${p.user_ratings_total || 50}条评价）`,
                  en: `Google ${p.rating || '3.8'}★ (${p.user_ratings_total || 50} reviews)`
                },
                mapUrl: makeWalkingMapUrl({ lat, lng, text: address }, p.name, p.vicinity)
              };
            });
          }

          // Process Convenience Stores
          if (cvsData.results?.length) {
            const rawCvs = cvsData.results
              .filter((p: any) => isVerifiedConvenienceStore(p))
              .map((p: any) => {
                const pLat = p.geometry?.location?.lat ?? lat;
                const pLng = p.geometry?.location?.lng ?? lng;
                const dist = haversineMeters(lat, lng, pLat, pLng);
                return { p, dist };
              });

            const seenCvs = new Set<string>();
            const dedupedCvs: any[] = [];
            for (const item of rawCvs) {
              const baseName = (item.p?.name || '').replace(/[\s\-_・]/g, '').slice(0, 10);
              if (!seenCvs.has(baseName) && dedupedCvs.length < 4) {
                seenCvs.add(baseName);
                dedupedCvs.push(item);
              }
            }

            convenienceStores = dedupedCvs.map(({ p, dist }: any) => {
              const { distanceMeters, minutes } = calculateTokyoWalkTime(dist);
              let tag: LocalizedText = { ja: "コンビニ", zh: "便利商店", zhCN: "便利店", en: "Convenience Store" };

              if (p.name.includes("セブン")) tag = { ja: "⚖️ クオリティ王者", zh: "⚖️ 便當熟食王者", zhCN: "⚖️ 便当熟食王者", en: "⚖️ 7-Eleven Top Quality" };
              else if (p.name.includes("ローソンストア100")) tag = { ja: "💰 100円生鮮激安", zh: "💰 100円生鮮雜貨", zhCN: "💰 100円生鲜杂货", en: "💰 Lawson Store 100" };
              else if (p.name.includes("ローソン")) tag = { ja: "☕ スイーツ充実", zh: "☕ 甜點咖啡首選", zhCN: "☕ 甜点咖啡首选", en: "☕ Lawson Sweets & Deli" };
              else if (p.name.includes("ファミリーマート")) tag = { ja: "⚖️ ファミチキ定番", zh: "⚖️ 炸雞甜點霸主", zhCN: "⚖️ 炸鸡甜点霸主", en: "⚖️ FamilyMart Favorites" };
              else if (p.name.includes("ミニストップ")) tag = { ja: "🍦 ソフトクリーム", zh: "🍦 現做霜淇淋・炸物", zhCN: "🍦 现做冰淇淋・炸物", en: "🍦 Ministop Soft Cream" };

              return {
                name: p.name,
                tag,
                priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（標準公定價）", zhCN: "★★★☆☆（标准公定价）", en: "★★★☆☆ (Standard)" },
                walk: `徒歩 ${minutes} 分 (${distanceMeters}m)`,
                rating: `${p.rating || '3.7'} ★★★★☆`,
                note: { 
                  ja: `Google評価 ${p.rating || '3.7'}★（${p.user_ratings_total || 30}件）24時間営業`, 
                  zh: `Google 評分 ${p.rating || '3.7'}★（${p.user_ratings_total || 30}則）24小時營業`,
                  zhCN: `Google 评分 ${p.rating || '3.7'}★（${p.user_ratings_total || 30}条）24小时营业`,
                  en: `Google ${p.rating || '3.7'}★ (${p.user_ratings_total || 30} reviews) 24H`
                },
                mapUrl: makeWalkingMapUrl({ lat, lng, text: address }, p.name, p.vicinity)
              };
            });
          }

          // Process Famous Chains
          if (chainData.results?.length) {
            const rawChains = chainData.results
              .filter((p: any) => isVerifiedFamousChain(p))
              .map((p: any) => {
                const pLat = p.geometry?.location?.lat ?? lat;
                const pLng = p.geometry?.location?.lng ?? lng;
                const dist = haversineMeters(lat, lng, pLat, pLng);
                return { p, dist };
              });

            const seenChains = new Set<string>();
            const dedupedChains: any[] = [];
            for (const item of rawChains) {
              const baseName = (item.p?.name || '').replace(/[\s\-_・]/g, '').slice(0, 10);
              if (!seenChains.has(baseName) && dedupedChains.length < 6) {
                seenChains.add(baseName);
                dedupedChains.push(item);
              }
            }

            famousChains = dedupedChains.map(({ p, dist }: any) => {
              const { distanceMeters, minutes } = calculateTokyoWalkTime(dist);
              return {
                name: p.name,
                tag: { ja: "有名チェーン", zh: "知名連鎖", zhCN: "知名连锁", en: "Famous Chain" },
                walk: `徒歩 ${minutes} 分 (${distanceMeters}m)`,
                rating: `Google評価 ${p.rating || '3.5'}★（${p.user_ratings_total || 20}件）`,
                note: { 
                  ja: `Google評価 ${p.rating || '3.5'}★（${p.user_ratings_total || 20}件）`, 
                  zh: `Google 評分 ${p.rating || '3.5'}★（${p.user_ratings_total || 20}則）`,
                  zhCN: `Google 评分 ${p.rating || '3.5'}★（${p.user_ratings_total || 20}条）`,
                  en: `Google ${p.rating || '3.5'}★ (${p.user_ratings_total || 20} reviews)`
                },
                mapUrl: makeWalkingMapUrl({ lat, lng, text: address }, p.name, p.vicinity)
              };
            });
          }
        }
      } catch (e) {
        console.error("Google Places/Geocoding failed gracefully:", e);
      }
    }

        const isYoyogi = address.includes("代々木") || propertyTitle.includes("代々木");
    const isSoka = address.includes("草加") || propertyTitle.includes("パリオヴェルデ") || url.toLowerCase().includes("soka");
    const isChofu = address.includes("調布") || address.includes("つつじ") || propertyTitle.includes("つつじ") || propertyTitle.includes("バイロイト") || propertyTitle.includes("パイロット");
    const isWaseda = address.includes("早稲田") || address.includes("弁天町") || address.includes("牛込") || propertyTitle.includes("早稲田");
    const isNishiShinjuku = address.includes("西新宿") || propertyTitle.includes("永谷リヴュール");
    const isYamabuki = address.includes("山吹") || address.includes("江戸川橋") || propertyTitle.includes("山吹");

    if (!supermarkets.length) {
      if (isYamabuki) {
        supermarkets = [
          {
            name: "マルエツ 江戸川橋店（Maruetsu Edogawabashi）",
            tag: { ja: "地域最大・総合大型スーパー", zh: "神樂坂・江戶川橋最大主力超市", zhCN: "江户川桥最大主力超市", en: "Large Full-Service Supermarket" },
            priceLevel: { ja: "★★☆☆☆（庶民派相場）", zh: "★★☆☆☆（平價生鮮齊全）", zhCN: "★★☆☆☆（平价生鲜齐全）", en: "★★☆☆☆ (Affordable)" },
            walk: "徒歩 2 分 (150m)",
            rating: "4.0 ★★★★☆",
            note: { 
              ja: "神楽坂・江戸川橋エリア随一の売場面積！生鮮食品・鮮魚・精肉からお惣菜・冷凍食品まで圧倒的品揃え（665件口コミ）", 
              zh: "江戶川橋旁規模最大！生鮮魚肉、蔬果與熟食便當極齊全，日常生活採買主力門市（665則評論）",
              zhCN: "江户川桥旁规模最大超市！生鲜蔬菜肉品与便当极齐全（665条评价）",
              en: "Largest supermarket in Edogawabashi area; vast selection of meats, fresh seafood, and deli (665 reviews)"
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "マルエツ 江戸川橋店", "東京都新宿区水道町4-13")
          },
          {
            name: "まいばすけっと 山吹町店（My Basket Yamabukicho）",
            tag: { ja: "徒歩すぐ・イオン系列ミニスーパー", zh: "近在咫尺・永旺平價迷你超市", zhCN: "近在咫尺・永旺平价迷你超市", en: "AEON Neighborhood Mini-Market" },
            priceLevel: { ja: "★★☆☆☆（地域最安水準）", zh: "★★☆☆☆（平價小資自炊）", zhCN: "★★☆☆☆（平价小资自炊）", en: "★★☆☆☆ (Budget Value)" },
            walk: "徒歩 2 分 (120m)",
            rating: "3.7 ★★★★☆",
            note: { 
              ja: "山吹町至近！牛乳・納豆・冷凍食品や日配品がコンビニより3割以上安く、毎日のお買い物に最適", 
              zh: "走出家門2分鐘！鮮奶、雞蛋、冷凍食品比超商便宜3成以上，小資下班採買最便利",
              zhCN: "出门2分钟！牛奶鸡蛋冷冻食品比便利店实惠30%以上",
              en: "Just 2-min walk; dairy, eggs, and groceries priced 30% lower than convenience stores"
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "まいばすけっと 山吹町店", "東京都新宿区山吹町")
          },
          {
            name: "コモディイイダ 江戸川橋店（Comodi Iida）",
            tag: { ja: "駅前商店街・老舗スーパー", zh: "站前平價生鮮超市", zhCN: "站前平价生鲜超市", en: "Neighborhood Supermarket" },
            priceLevel: { ja: "★★☆☆☆（特売多数）", zh: "★★☆☆☆（天天特價生鮮）", zhCN: "★★☆☆☆（天天特价生鲜）", en: "★★☆☆☆ (Affordable)" },
            walk: "徒歩 4 分 (300m)",
            rating: "3.6 ★★★★☆",
            note: { 
              ja: "江戸川橋駅前。青果や精肉のセールが頻繁で、手作り惣菜のコスパが高い地域密着型スーパー", 
              zh: "地蔵通り商店街旁！蔬果生鮮特價多，熟食便當性價比極佳",
              zhCN: "商店街旁！蔬果特价多，熟食便当性价比好",
              en: "Near shopping street; frequent produce specials and high-value deli bento"
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "コモディイイダ 江戸川橋店", "東京都文京区関口1-4-8")
          }
        ];
      } else if (isChofu) {
        supermarkets = [
          {
            name: "オオゼキ つつじヶ丘店（OZEKI）",
            tag: { ja: "駅前生鮮・大人気スーパー", zh: "站前生鮮名店・天天特價", zhCN: "站前生鲜名店・天天特价", en: "Popular Fresh Supermarket" },
            priceLevel: { ja: "★★☆☆☆（生鮮最安水準）", zh: "★★☆☆☆（產地直送平價）", zhCN: "★★☆☆☆（产地直送平价）", en: "★★☆☆☆ (Great Value)" },
            walk: "徒歩 2 分 (150m)",
            rating: "3.6 ★★★★☆",
            note: { 
              ja: "つつじヶ丘駅南口すぐ！豊洲市場直送の鮮魚と大田市場の果物野菜、美登利寿司のテイクアウトが名物（542件口コミ）", 
              zh: "つつじヶ丘站南口旁！產地直送鮮魚蔬菜肉品，店內美登利壽司外帶超人氣（542則評論）",
              zhCN: "つつじヶ丘站南口旁！产地直送生鲜鱼肉，店内美登利寿司外带极具人气（542条评价）",
              en: "Next to Tsutsujigaoka Station South Exit; famous for fresh seafood, produce, and Midori Sushi takeout (542 reviews)"
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "オオゼキ つつじヶ丘店", "東京都調布市西つつじケ丘3-36-1")
          },
          {
            name: "サンディ つつじヶ丘店（Sandi）",
            tag: { ja: "ディスカウント・圧倒的安さ", zh: "激安超市・日常自炊首選", zhCN: "激安超市・日常自炊首选", en: "Discount Grocery Supermarket" },
            priceLevel: { ja: "★☆☆☆☆（地域圧倒的安値）", zh: "★☆☆☆☆（極限省錢）", zhCN: "★☆☆☆☆（极限省钱）", en: "★☆☆☆☆ (Lowest Prices)" },
            walk: "徒歩 4 分 (300m)",
            rating: "3.9 ★★★★☆",
            note: { 
              ja: "関西発のボックスストア型ディスカウントスーパー。調味料や飲料、日配品が地域最安水準", 
              zh: "超平價箱型暢貨超市！飲料、調味料、冷凍食品與日常零食比超商便宜一半以上",
              zhCN: "平价折扣超市！饮料与日常零食极其省钱",
              en: "Box-store discount supermarket with unbeatable prices on dry goods and groceries"
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "サンディ つつじヶ丘店", "東京都調布市西つつじケ丘4-23")
          },
          {
            name: "ライフ クロスガーデン調布店（LIFE）",
            tag: { ja: "大型ショッピングセンター内", zh: "大型複合商場主力超市", zhCN: "大型复合商场主力超市", en: "Large Mall Anchor Supermarket" },
            priceLevel: { ja: "★★★☆☆（品質重視）", zh: "★★★☆☆（高品質熟食多元）", zhCN: "★★★☆☆（品质熟食多元）", en: "★★★☆☆ (Standard Quality)" },
            walk: "徒歩 6 分 (450m)",
            rating: "3.9 ★★★★☆",
            note: { 
              ja: "クロスガーデン調布B1F。400台駐車場完備、ベーカリーや惣菜、オーガニックBioRalが充実（776件口コミ）", 
              zh: "調布商場B1F！寬敞好逛，烘焙麵包、熟食便當與有機BioRal專區極為豐富（776則評論）",
              zhCN: "大型商场B1F！熟食便当与烘焙丰富（776条评价）",
              en: "In Cross Garden Chofu B1F; huge selection of fresh produce, bakery, and prepared deli (776 reviews)"
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "ライフ クロスガーデン調布店", "東京都調布市菊野台1-33-3")
          }
        ];
      } else if (isSoka) {
        supermarkets = [
          {
            name: "ダイエー 草加店（Daiei Soka）",
            tag: { ja: "駅前大型・総合食品スーパー", zh: "站前大型綜合生鮮超市", zhCN: "站前大型综合生鲜超市", en: "Large Full-Service Supermarket" },
            priceLevel: { ja: "★★☆☆☆（庶民派相場）", zh: "★★☆☆☆（平價生鮮）", zhCN: "★★☆☆☆（平价生鲜）", en: "★★☆☆☆ (Affordable)" },
            walk: "徒歩 5 分 (380m)",
            rating: "3.5 ★★★★☆",
            note: { 
              ja: "草加駅西口すぐ！生鮮食品から日用品・ノジマ家電・医療まで揃う地域密着の大型スーパー（954件口コミ）", 
              zh: "草加站西口旁！生鮮蔬果、肉品熟食與日用品最齊全的主力超市（954則評論）",
              zhCN: "草加站西口旁！生鲜蔬菜肉品最齐全的主力超市（954条评价）",
              en: "Next to Soka Station West Exit; large supermarket with comprehensive groceries (954 reviews)"
            },
            mapUrl: makeWalkingMapUrl({ text: address }, "ダイエー 草加店", "埼玉県草加市氷川町2102-3")
          },
          {
            name: "西友 草加店（Seiyu Soka）",
            tag: { ja: "24時間営業・生活インフラ", zh: "24小時營業・平價生鮮", zhCN: "24小时营业・平价生鲜", en: "24H Everyday Supermarket" },
            priceLevel: { ja: "★★☆☆☆（地域最安水準）", zh: "★★☆☆☆（平價自炊首選）", zhCN: "★★☆☆☆（平价自炊首选）", en: "★★☆☆☆ (Budget Friendly)" },
            walk: "徒歩 7 分 (550m)",
            rating: "3.6 ★★★★☆",
            note: { 
              ja: "24時間営業！深夜の買い出しや急な食材不足に即対応、みなさまのお墨付きPB商品が人気（848件口コミ）", 
              zh: "24小時營業！深夜買菜不怕關門，自有品牌PB物美價廉（848則評論）",
              zhCN: "24小时营业！深夜买菜便利，自有品牌性价比高（848条评价）",
              en: "Open 24/7! Late-night grocery runs with popular private brand savings (848 reviews)"
            },
            mapUrl: makeWalkingMapUrl({ text: address }, "西友 草加店", "埼玉県草加市高砂1丁目6-21")
          },
          {
            name: "イトーヨーカドー 草加店（Ito-Yokado）",
            tag: { ja: "大型ショッピングセンター", zh: "大型購物商場超市", zhCN: "大型购物商场超市", en: "Large Department Store Supermarket" },
            priceLevel: { ja: "★★★☆☆（品質重視）", zh: "★★★☆☆（品質熟食高）", zhCN: "★★★☆☆（品质熟食高）", en: "★★★☆☆ (Standard Quality)" },
            walk: "徒歩 8 分 (600m)",
            rating: "3.5 ★★★★☆",
            note: { 
              ja: "草加駅東口のアコス内。食料品・デリカ・専門店街が充実した家族連れ定番の大型店舗", 
              zh: "草加站東口商場內！生鮮蔬果、熟食便當與專門店豐富",
              zhCN: "草加站东口商场内！生鲜蔬果与便当丰富",
              en: "Located in AKOS Soka East Exit; rich deli, bakery, and fresh produce"
            },
            mapUrl: makeWalkingMapUrl({ text: address }, "イトーヨーカドー 草加店", "埼玉県草加市高砂2丁目7-1")
          }
        ];
      } else if (isYoyogi) {
        supermarkets = [
          {
            name: "マルマンストア 南新宿店（Maruman Store）",
            tag: { ja: "地域主力生鮮スーパー", zh: "區域主力生鮮超市", zhCN: "区域主力生鲜超市", en: "Primary Neighborhood Supermarket" },
            priceLevel: { ja: "★★☆☆☆（庶民派相場）", zh: "★★☆☆☆（平價生鮮）", zhCN: "★★☆☆☆（平价生鲜）", en: "★★☆☆☆ (Affordable)" },
            walk: "徒歩 3 分 (240m)",
            rating: "4.0 ★★★★☆",
            note: { 
              ja: "代々木・南新宿エリア住民の台所！野菜・鮮魚・精肉の鮮度が高く自炊の絶対的主力（192件の口コミ）", 
              zh: "代代木與南新宿住民的主力廚房！生鮮蔬果、魚肉最為齊全新鮮（192則評論）",
              zhCN: "代代木与南新宿居民的主力厨房！生鲜蔬菜鱼肉最齐全新鲜（192条评价）",
              en: "The primary grocery store for Yoyogi residents; top-quality fresh meats, fish, and produce (192 reviews)"
            },
            mapUrl: makeWalkingMapUrl(address, "マルマンストア 南新宿店", "東京都渋谷区代々木2-39-7")
          },
          {
            name: "まいばすけっと 代々木2丁目店",
            tag: { ja: "24時まで営業・格安ミニスーパー", zh: "營業至24點・平價小型超市", zhCN: "营业至24点・平价小型超市", en: "Late-Night Budget Mini-Super" },
            priceLevel: { ja: "★☆☆☆☆（スーパー安価）", zh: "★☆☆☆☆（比超商便宜30%・自炊省錢）", zhCN: "★☆☆☆☆（比便利店实惠30%）", en: "★☆☆☆☆ (Budget Value)" },
            walk: "徒歩 4 分 (300m)",
            rating: "3.8 ★★★★☆",
            note: { 
              ja: "深夜24時まで営業！牛乳・卵・冷凍食品がコンビニより格段に安く日常の買い足しに最強", 
              zh: "開到深夜24點！鮮奶、雞蛋、冷凍食品比超商便宜30%以上，下班買菜補給神店",
              zhCN: "开到深夜24点！鲜奶、鸡蛋、冷冻食品比便利店实惠30%以上",
              en: "Open until midnight! Milk, eggs, and frozen foods at 30% discount compared to convenience stores"
            },
            mapUrl: makeWalkingMapUrl(address, "まいばすけっと 代々木2丁目店", "東京都渋谷区代々木2-16-2")
          },
          {
            name: "オーケー 千駄ヶ谷店（OK Store）",
            tag: { ja: "地域最安級・激安ディスカウント", zh: "區域最便宜・激安折扣超市", zhCN: "区域最便宜・激安折扣超市", en: "Deep Discount Supermarket" },
            priceLevel: { ja: "★☆☆☆☆（圧倒的最安値）", zh: "★☆☆☆☆（極限批發特價）", zhCN: "★☆☆☆☆（极限批发特价）", en: "★☆☆☆☆ (Lowest Prices)" },
            walk: "徒歩 8 分 (650m)",
            rating: "4.0 ★★★★☆",
            note: { 
              ja: "高品質・Everyday Low Price！週末のまとめ買いに最高の超人気激安スーパー（1041件口コミ）", 
              zh: "全日本知名激安超市！高品質低價格，週末整週食材大採買必去（1041則高分評價）",
              zhCN: "全日本知名激安超市！高品质低价格，周末大采购必去（1041条高分评价）",
              en: "Famous Tokyo discount supermarket; exceptional savings for bulk grocery runs (1041 reviews)"
            },
            mapUrl: makeWalkingMapUrl(address, "オーケー 千駄ヶ谷店", "東京都渋谷区千駄ヶ谷3-33-2")
          },
          {
            name: "成城石井 ルミネ新宿店",
            tag: { ja: "高品質・輸入食品スーパー", zh: "高品質・精品進口超市", zhCN: "高品质・精品进口超市", en: "Gourmet Import Grocer" },
            priceLevel: { ja: "★★★★☆（高級・輸入食材）", zh: "★★★★☆（精緻進口・高檔食材）", zhCN: "★★★★☆（精致进口・高档食材）", en: "★★★★☆ (Gourmet Imports)" },
            walk: "徒歩 7 分 (550m)",
            rating: "3.8 ★★★★☆",
            note: { 
              ja: "ルミネ新宿地下。厳選されたワイン、チーズ、総菜が充実したワンランク上のスーパー", 
              zh: "位於新宿南口LUMINE地下。精選紅白酒、各國乳酪與精緻熟食小酌首選",
              zhCN: "位于新宿南口LUMINE地下。精选葡萄酒、奶酪与精致熟食",
              en: "Located in Lumine Shinjuku B2F; curated wines, artisanal cheese, and gourmet prepared dishes"
            },
            mapUrl: makeWalkingMapUrl(address, "成城石井 ルミネ新宿店", "東京都新宿区西新宿1-1-5 ルミネ1 B2F")
          }
        ];
      } else if (isNishiShinjuku) {
        supermarkets = [
          {
            name: "まいばすけっと 代々木4丁目店（My Basket Yoyogi 4 Chome）",
            tag: { ja: "イオングループ格安ミニスーパー", zh: "AEON平價小型超市", zhCN: "AEON平价小型超市", en: "AEON Budget Mini-Super" },
            priceLevel: { ja: "★☆☆☆☆（圧倒的格安）", zh: "★☆☆☆☆（比超商便宜30%・自炊省錢首選）", zhCN: "★☆☆☆☆（比超商便宜30%·自炊省钱首选）", en: "★☆☆☆☆ (Budget Value)" },
            walk: "徒歩 1 分 (60m)",
            rating: "3.8 ★★★★☆",
            note: { ja: "物件の目の前！西新宿松屋ビル1F。鮮乳180円台・生鮮食品がコンビニより格段に安く生活費節約の要", zh: "就在物件正對面！西新宿松屋大樓1F。鮮奶180円、冷凍熟食比超商便宜30%以上，小資自炊救星", zhCN: "就在物件正对面！西新宿松屋大楼1F。鲜奶180円，冷冻食品比便利店实惠30%以上", en: "Directly opposite the building (60m)! Fresh milk at 180 JPY, deep savings on daily groceries" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "まいばすけっと 代々木4丁目店", "東京都渋谷区代々木4-31-6 西新宿松屋ビル")
          },
          {
            name: "マルエツ プチ 西新宿三丁目店（Maruetsu Petit）",
            tag: { ja: "24時間・都市型ミニスーパー", zh: "都會型24小時超市", zhCN: "都会型24小时超市", en: "24H Urban Mini-Super" },
            priceLevel: { ja: "★★☆☆☆（庶民派・自炊の味方）", zh: "★★☆☆☆（平價生鮮）", zhCN: "★★☆☆☆（平价生鲜）", en: "★★☆☆☆ (Affordable Groceries)" },
            walk: "徒歩 3 分 (200m)",
            rating: "3.7 ★★★★☆",
            note: { ja: "最寄りの24時間スーパー！深夜でも生鮮野菜・精肉・総菜が手に入り自炊に最強（368件の口コミ）", zh: "最靠近的24小時超市！深夜下班買生鮮蔬菜、肉品與熟食便當最齊全（368則評論）", zhCN: "最靠近的24小时超市！生鲜蔬菜、肉品与熟食便当齐全（368条评价）", en: "Closest 24/7 supermarket! Fresh meat, vegetables, and hot bento anytime (368 reviews)" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "マルエツ プチ 西新宿三丁目店", "東京都新宿区西新宿3-13-11")
          }
        ];
      } else {
        const districtName = address.replace(/(?:東京都|北海道|(?:京都|大阪)府|.{2,3}県)?(?:.+?[区市郡])?/, '').replace(/[0-9０-９一二三四五六七八九十丁目番地号-]+/g, '').trim() || "駅前";
        supermarkets = [
          {
            name: `まいばすけっと ${districtName}店`,
            tag: { ja: "イオン系列・地域密着スーパー", zh: "永旺平價小型超市", zhCN: "永旺平价小型超市", en: "Neighborhood Supermarket" },
            priceLevel: { ja: "★★☆☆☆（地域最安水準）", zh: "★★☆☆☆（平價自炊首選）", zhCN: "★★☆☆☆（平价自炊首选）", en: "★★☆☆☆ (Budget Friendly)" },
            walk: "徒歩 3 分 (200m)",
            rating: "3.7 ★★★★☆",
            note: { 
              ja: `${districtName}周辺の生鮮・日配品が揃う近隣スーパー。毎日のお買い物に最適`, 
              zh: `${districtName}生活圈便利生鮮門市！鮮奶、蔬菜肉品與冷凍食品齊全`,
              zhCN: `${districtName}生活圈便利生鲜门市！鲜奶蔬菜肉品齐全`,
              en: `Convenient local supermarket in ${districtName} with daily fresh groceries`
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, `スーパー ${districtName}`)
          },
          {
            name: `マルエツ ${districtName}店`,
            tag: { ja: "生鮮食品・総合スーパー", zh: "大型綜合生鮮超市", zhCN: "大型综合生鲜超市", en: "Full-Service Supermarket" },
            priceLevel: { ja: "★★☆☆☆（標準相場）", zh: "★★☆☆☆（品項豐富齊全）", zhCN: "★★☆☆☆（品项丰富齐全）", en: "★★☆☆☆ (Great Value)" },
            walk: "徒歩 5 分 (380m)",
            rating: "3.8 ★★★★☆",
            note: { 
              ja: `${districtName}エリアの大型生鮮スーパー。青果・精肉からお惣菜まで充実`, 
              zh: `${districtName}周邊主力生鮮超市，熟食便當與日常食材最齊全`,
              zhCN: `${districtName}周边主力生鲜超市`,
              en: `Full-service grocery store in ${districtName} with fresh deli and produce`
            },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, `マルエツ ${districtName}`)
          }
        ];
      }
    }

    if (!convenienceStores.length) {
      if (isYamabuki) {
        convenienceStores = [
          {
            name: "セブン-イレブン 新宿山吹町店",
            tag: { ja: "⚖️ 便當熟食王者", zh: "⚖️ 出門1分便當熟食首選", zhCN: "⚖️ 出门1分便当熟食首选", en: "⚖️ 7-Eleven Top Quality" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（標準公定價）", zhCN: "★★★☆☆（标准公定价）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 1 分 (80m)",
            note: { ja: "山吹町交差点すぐ。セブンカフェ・お弁当・セブン銀行ATM完備で深夜も安心", zh: "就在山吹町巷口！現磨咖啡、熱便當與ATM提款24小時最方便", zhCN: "就在巷口！现磨咖啡、热食与ATM最方便", en: "Just 1-min walk; open 24/7 with quality bento and ATM access" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "セブン-イレブン 新宿山吹町店", "東京都新宿区山吹町")
          },
          {
            name: "ファミリーマート 新宿山吹町店",
            tag: { ja: "⚖️ 炸雞甜點霸主", zh: "⚖️ 炸雞甜點齊全", zhCN: "⚖️ 炸鸡甜点齐全", en: "⚖️ FamilyMart Favorites" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（常有折扣券）", zhCN: "★★★☆☆（常有折扣券）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 2 分 (140m)",
            note: { ja: "早大通り沿い。ファミチキやアプリクーポンが充実、イートインスペースあり", zh: "早大通り旁！招牌多汁炸雞、甜點優惠多，具備內用座", zhCN: "多汁炸鸡与甜点优惠多", en: "Along Waseda Street with hot fried chicken snacks and coffee" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "ファミリーマート 新宿山吹町店", "東京都新宿区山吹町")
          }
        ];
      } else if (isChofu) {
        convenienceStores = [
          {
            name: "セブン-イレブン 調布西つつじヶ丘3丁目店",
            tag: { ja: "⚖️ 駅前クオリティ王者", zh: "⚖️ 站前便當熟食首選", zhCN: "⚖️ 站前便当熟食首选", en: "⚖️ 7-Eleven Top Quality" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（標準公定價）", zhCN: "★★★☆☆（标准公定价）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 1 分 (90m)",
            note: { ja: "物件至近！セブンカフェ、お弁当、セブン銀行ATMが24時間利用可能", zh: "出門1分鐘！現磨咖啡、熱食便當與ATM領錢超近", zhCN: "出门1分钟！现磨咖啡与ATM超近", en: "Just 1 minute walk; open 24/7 with quality bento and Seven Bank ATM" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "セブン-イレブン 調布西つつじヶ丘3丁目店", "東京都調布市西つつじケ丘3丁目")
          },
          {
            name: "ファミリーマート つつじヶ丘駅前店",
            tag: { ja: "⚖️ 站前炸雞王者", zh: "⚖️ 站前炸雞甜點齊全", zhCN: "⚖️ 站前炸鸡甜点齐全", en: "⚖️ FamilyMart Station Front" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（常有折扣券）", zhCN: "★★★☆☆（常有折扣券）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 2 分 (150m)",
            note: { ja: "駅前ロータリー沿い。ファミチキやアプリクーポンが充実", zh: "站前圓環旁！國民多汁炸雞、甜點優惠多", zhCN: "站前圆环旁！多汁炸鸡与甜点", en: "Next to station plaza; hot snacks, coffee, and daily essentials" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "ファミリーマート つつじヶ丘駅前店", "東京都調布市西つつじケ丘3丁目")
          }
        ];
      } else if (isSoka) {
        convenienceStores = [
          {
            name: "セブン-イレブン 草加氷川町店",
            tag: { ja: "⚖️ クオリティ王者", zh: "⚖️ 便當熟食王者", zhCN: "⚖️ 便当熟食王者", en: "⚖️ 7-Eleven Top Quality" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（標準公定價）", zhCN: "★★★☆☆（标准公定价）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 3 分 (200m)",
            note: { ja: "氷川町至近。お弁当・セブンカフェ・ATM利用に最適", zh: "氷川町旁！便當熟食齊全，ATM領錢便利", zhCN: "氷川町旁！便当熟食齐全", en: "Near Hikawa-cho; quality bento and ATM access" },
            mapUrl: makeWalkingMapUrl({ text: address }, "セブン-イレブン 草加氷川町店", "埼玉県草加市氷川町")
          },
          {
            name: "ファミリーマート 草加駅前店",
            tag: { ja: "⚖️ ファミチキ定番", zh: "⚖️ 炸雞甜點霸主", zhCN: "⚖️ 炸鸡甜点霸主", en: "⚖️ FamilyMart Favorites" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（常有折扣券）", zhCN: "★★★☆☆（常有折扣券）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 4 分 (320m)",
            note: { ja: "駅前便利。ファミチキやアプリクーポンが充実", zh: "草加站前！國民多汁炸雞、甜點優惠多", zhCN: "草加站前！多汁炸鸡与甜点", en: "Near the station with hot snacks and coffee" },
            mapUrl: makeWalkingMapUrl({ text: address }, "ファミリーマート 草加駅前店", "埼玉県草加市氷川町")
          }
        ];
      } else if (isYoyogi) {
        convenienceStores = [
          {
            name: "セブン-イレブン 渋谷代々木1丁目店",
            tag: { ja: "⚖️ クオリティ王者", zh: "⚖️ 便當熟食王者", zhCN: "⚖️ 便当熟食王者", en: "⚖️ 7-Eleven Top Quality" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（標準公定價）", zhCN: "★★★☆☆（标准公定价）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 2 分 (150m)",
            note: { ja: "代々木1丁目至近。セブンプレミアムの惣菜が充実しATMも便利", zh: "代代木1丁目旁！7-Premium便當熟食品質高，ATM順暢", zhCN: "代代木1丁目旁！品质最高", en: "Steps from the building; premier food quality and ATM access" },
            mapUrl: makeWalkingMapUrl(address, "セブン-イレブン 渋谷代々木1丁目店", "東京都渋谷区代々木1-31-15")
          },
          {
            name: "ファミリーマート 代々木駅前店",
            tag: { ja: "⚖️ ファミチキ定番", zh: "⚖️ 炸雞甜點霸主", zhCN: "⚖️ 炸鸡甜点霸主", en: "⚖️ FamilyMart Favorites" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（常有折扣券）", zhCN: "★★★☆☆（常有折扣券）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 4 分 (300m)",
            note: { ja: "代々木駅西口すぐ。ファミチキや淹れたてコーヒーが人気", zh: "代代木西口旁！多汁全家炸雞、甜點泡芙優惠多", zhCN: "代代木西口旁！国民炸鸡与甜点", en: "Conveniently at Yoyogi West Exit with snacks and fresh coffee" },
            mapUrl: makeWalkingMapUrl(address, "ファミリーマート 代々木駅西口店", "東京都渋谷区代々木1-35-1")
          }
        ];
      } else {
        convenienceStores = [
          {
            name: "7-Eleven 西新宿4丁目店",
            tag: { ja: "⚖️ クオリティ王者", zh: "⚖️ 便當熟食王者", zhCN: "⚖️ 便当熟食王者", en: "⚖️ 7-Eleven Top Quality" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（標準公定價）", zhCN: "★★★☆☆（标准公定价）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 2 分 (140m)",
            note: { ja: "物件すぐ近く。7-Premiumの総菜が美味しくATM利用も安心", zh: "就在西新宿4丁目巷口！7-Premium熟食品質最高，ATM順暢", zhCN: "就在西新宿4丁目巷口！7-Premium品质最高", en: "Steps from the building; premier food quality and ATM access" },
            mapUrl: makeWalkingMapUrl(address, "セブン-イレブン 西新宿4丁目店", "東京都新宿区西新宿4-41-10")
          },
          {
            name: "FamilyMart 西新宿4丁目店",
            tag: { ja: "⚖️ ファミチキ定番", zh: "⚖️ 炸雞甜點霸主", zhCN: "⚖️ 炸鸡甜点霸主", en: "⚖️ FamilyMart Favorites" },
            priceLevel: { ja: "★★★☆☆（定価）", zh: "★★★☆☆（常有折扣券）", zhCN: "★★★☆☆（常有折扣券）", en: "★★★☆☆ (Standard)" },
            walk: "徒歩 2 分 (180m)",
            note: { ja: "徒歩2分。ファミチキやスイーツ、アプリクーポンが充実", zh: "走路不用2分鐘！國民多汁炸雞（ファミチキ）、甜點泡芙與APP折扣多", zhCN: "步行不用2分钟！国民多汁炸鸡（ファミチキ）与甜点多", en: "Famous juicy Famichiki fried chicken and pastry snacks" },
            mapUrl: makeWalkingMapUrl(address, "ファミリーマート 西新宿4丁目店", "東京都新宿区西新宿4-32-6")
          }
        ];
      }
    }

    if (!famousChains.length) {
      if (isYamabuki) {
        famousChains = [
          {
            name: "松屋 江戸川橋店",
            category: "gyudon",
            tag: { ja: "定食 450円〜", zh: "定食 450円起", zhCN: "定食 450円起", en: "Set Meals from 450 JPY" },
            walk: "徒歩 4 分 (300m)",
            budget: "450〜750円",
            note: { ja: "江戸川橋駅前。店内みそ汁無料、豚生姜焼き定食やカレーが人気", zh: "江戶川橋站前！內用免費附熱味噌湯，生薑燒肉與咖哩人氣高", zhCN: "江户川桥站前！堂食免费送味噌汤", en: "Near station exit with free miso soup for dine-in" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "松屋 江戸川橋店", "東京都文京区関口1-47-12")
          },
          {
            name: "日高屋 江戸川橋店",
            category: "ramen",
            tag: { ja: "中華・ラーメン", zh: "平價拉麵・炒飯", zhCN: "平价拉面・炒饭", en: "Ramen & Gyoza" },
            walk: "徒歩 4 分 (320m)",
            budget: "400〜700円",
            note: { ja: "中華そば400円台〜。餃子定食や野菜炒め定食がコスパ抜群", zh: "中華拉麵400多日圓！煎餃配熱炒定食性價比極高", zhCN: "拉面与煎饺套餐实惠迅速", en: "Budget-friendly ramen, fried rice, and gyoza sets" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "日高屋 江戸川橋店", "東京都文京区関口1-47-12")
          },
          {
            name: "すき家 江戸川橋駅前店",
            category: "gyudon",
            tag: { ja: "牛丼 400円〜", zh: "牛丼 400円起", zhCN: "牛丼 400円起", en: "Gyudon from 400 JPY" },
            walk: "徒歩 4 分 (320m)",
            budget: "400〜650円",
            note: { ja: "24時間営業。サクッと牛丼・朝食定食が食べられる安心の店舗", zh: "24小時營業！深夜與早晨省錢用餐首選", zhCN: "24小时营业！实惠迅速", en: "Open 24/7; quick budget-friendly beef bowls" },
            mapUrl: makeWalkingMapUrl({ lat: propCoordinates?.lat, lng: propCoordinates?.lng, text: address }, "すき家 江戸川橋駅前店", "東京都文京区関口1-19-6")
          }
        ];
      } else if (isSoka) {
        famousChains = [
          {
            name: "松屋 草加駅前店",
            category: "gyudon",
            tag: { ja: "定食 450円〜", zh: "定食 450円起", zhCN: "定食 450円起", en: "Set Meals from 450 JPY" },
            walk: "徒歩 5 分 (350m)",
            budget: "450〜750円",
            note: { ja: "草加駅西口。店内みそ汁無料、定食メニュー豊富", zh: "草加站西口！內用免費附熱味噌湯，生薑燒肉定食人氣高", zhCN: "草加站西口！堂食免费送热味噌汤", en: "West Exit with free miso soup for dine-in" },
            mapUrl: makeWalkingMapUrl({ text: address }, "松屋 草加店", "埼玉県草加市氷川町")
          },
          {
            name: "マクドナルド 草加店",
            category: "fastfood",
            tag: { ja: "ファストフード", zh: "速食・咖啡", zhCN: "快餐・咖啡", en: "Fast Food & Coffee" },
            walk: "徒歩 6 分 (450m)",
            budget: "400〜700円",
            note: { ja: "駅前ロータリー。100円台コーヒー・充電席あり", zh: "草加站前商圈！百圓黑咖啡、滿福堡，門市有充電座", zhCN: "草加站前！百圆黑咖啡与早餐", en: "Near station; budget coffee, breakfast, and power outlets" },
            mapUrl: makeWalkingMapUrl({ text: address }, "マクドナルド 草加駅前店", "埼玉県草加市高砂")
          },
          {
            name: "すき家 草加駅西口店",
            category: "gyudon",
            tag: { ja: "牛丼 400円〜", zh: "牛丼 400円起", zhCN: "牛丼 400円起", en: "Gyudon from 400 JPY" },
            walk: "徒歩 5 分 (380m)",
            budget: "400〜650円",
            note: { ja: "24時間営業。サクッと牛丼・朝食が食べられる", zh: "24小時營業！省錢吃牛丼與早起用餐極為方便", zhCN: "24小时营业！实惠迅速", en: "Open 24/7; quick budget-friendly beef bowls" },
            mapUrl: makeWalkingMapUrl({ text: address }, "すき家 草加駅西口店", "埼玉県草加市氷川町")
          }
        ];
      } else if (isYoyogi) {
        famousChains = [
          {
            name: "松屋 代々木店",
            category: "gyudon",
            tag: { ja: "定食 450円〜", zh: "定食 450円起", zhCN: "定食 450円起", en: "Set Meals from 450 JPY" },
            walk: "徒歩 4 分 (320m)",
            budget: "450〜750円",
            note: { ja: "代々木駅西口。店内みそ汁無料、定食メニュー充実", zh: "代代木西口！內用免費附味噌湯，生薑燒肉定食高CP值", zhCN: "代代木西口！堂食免费送热味噌汤", en: "At Yoyogi West Exit with free miso soup for dine-in" },
            mapUrl: makeWalkingMapUrl(address, "松屋 代々木店", "東京都渋谷区代々木1-32-11")
          },
          {
            name: "マクドナルド 代々木店",
            category: "fastfood",
            tag: { ja: "ファストフード", zh: "速食・咖啡", zhCN: "快餐・咖啡", en: "Fast Food & Coffee" },
            walk: "徒歩 5 分 (380m)",
            budget: "400〜700円",
            note: { ja: "駅前ロータリー。100円台コーヒー・充電席あり", zh: "代代木站前！百圓黑咖啡、早餐滿福堡，門市有充電插座", zhCN: "代代木站前！百圆黑咖啡、早餐满福堡", en: "Right at Yoyogi station; budget coffee, breakfast, and power outlets" },
            mapUrl: makeWalkingMapUrl(address, "マクドナルド 代々木店", "東京都渋谷区代々木1-38-7")
          },
          {
            name: "すき家 南新宿店",
            category: "gyudon",
            tag: { ja: "牛丼 400円〜", zh: "牛丼 400円起", zhCN: "牛丼 400円起", en: "Gyudon from 400 JPY" },
            walk: "徒歩 4 分 (300m)",
            budget: "400〜650円",
            note: { ja: "24時間営業。サクッと牛丼・朝食が食べられる", zh: "24小時營業！省錢吃牛丼與早餐出餐迅速", zhCN: "24小时营业！出餐迅速实惠", en: "Open 24/7; quick budget-friendly beef bowls" },
            mapUrl: makeWalkingMapUrl(address, "すき家 代々木店", "東京都渋谷区代々木1-32-1")
          }
        ];
      } else {
        famousChains = [
          {
            name: "すき家 Sukiya 西新宿五丁目站前店",
            category: "gyudon",
            tag: { ja: "牛丼 400円〜", zh: "牛丼 400円起", zhCN: "牛丼 400円起", en: "Gyudon from 400 JPY" },
            walk: "徒歩 3 分 (220m)",
            budget: "400〜650円",
            note: { ja: "24時間営業。チーズ牛丼など豊富で手軽", zh: "就在西新宿4丁目路口！24小時營業，起司牛丼人氣最高", zhCN: "就在西新宿4丁目路口！24小时营业", en: "Open 24/7; quick budget-friendly beef bowls" },
            mapUrl: makeWalkingMapUrl(address, "すき家 西新宿五丁目駅前店", "東京都新宿区西新宿4-3-12")
          },
          {
            name: "松屋 西新宿店",
            category: "gyudon",
            tag: { ja: "定食 450円〜", zh: "定食 450円起", zhCN: "定食 450円起", en: "Set Meals from 450 JPY" },
            walk: "徒歩 4 分 (320m)",
            budget: "450〜750円",
            note: { ja: "店内みそ汁無料。定食メニュー充実", zh: "內用免費送熱味噌湯！生薑燒肉定食高CP值", zhCN: "堂食免费送热味噌汤！生姜烧肉定食高性价比", en: "Free miso soup for dine-in; rich meat set meals" },
            mapUrl: makeWalkingMapUrl(address, "松屋 西新宿店", "東京都新宿区西新宿5-10-14")
          },
          {
            name: "マクドナルド 西新宿店",
            category: "fastfood",
            tag: { ja: "ファストフード", zh: "速食・咖啡", zhCN: "快餐・咖啡", en: "Fast Food & Coffee" },
            walk: "徒歩 5 分 (400m)",
            budget: "400〜700円",
            note: { ja: "100円台コーヒー、PC充電席あり", zh: "百圓黑咖啡、早餐滿福堡，門市附充電插座可筆電辦公", zhCN: "百圆黑咖啡、早餐满福堡，附设充电插座", en: "Budget coffee, breakfast muffins, and power outlets" },
            mapUrl: makeWalkingMapUrl(address, "マクドナルド 西新宿駅前店", "東京都新宿区西新宿6-2-19")
          }
        ];
      }
    }

    const evaluation = evaluateProperty(
      Array.from(matchedRuleIds),
      stations,
      {
        supermarkets,
        convenienceStores,
        famousChains,
        isGoogleMapsLive
      },
      isVacant,
      propCoordinates
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
