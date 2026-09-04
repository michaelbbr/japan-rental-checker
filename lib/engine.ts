import { RULES } from './rules';
import { 
  EvaluationResult, 
  Dimension, 
  RatingSymbol, 
  DimensionScore, 
  ConditionCard, 
  NaikenItem,
  StationDetail,
  LifeAmenityItem
} from './types';

const DIMENSIONS: Array<{ key: Dimension; label: { zh: string; ja: string } }> = [
  { key: "location", label: { zh: "立地", ja: "立地" } },
  { key: "rent", label: { zh: "家賃", ja: "家賃" } },
  { key: "sunlight", label: { zh: "日当たり", ja: "日当たり" } },
  { key: "building", label: { zh: "建物", ja: "建物" } },
  { key: "security", label: { zh: "防犯", ja: "防犯" } },
  { key: "quietness", label: { zh: "静かさ", ja: "静かさ" } }
];

export function evaluateProperty(
  matchedIds: string[],
  stations: StationDetail[],
  amenities: {
    supermarkets: LifeAmenityItem[];
    convenienceStores: LifeAmenityItem[];
    famousChains: LifeAmenityItem[];
    isGoogleMapsLive?: boolean;
  },
  isVacant: boolean,
  coordinates?: { lat: number; lng: number }
): EvaluationResult {
  const dimScores: Record<Dimension, number> = {
    location: 0,
    rent: 0,
    sunlight: 0,
    building: 0,
    security: 0,
    quietness: 0
  };

  const conditions: ConditionCard[] = [];
  const naiken: NaikenItem[] = [];
  const seenNaiken = new Set<string>();

  const ruleMap = new Map(RULES.map(r => [r.id, r]));

  matchedIds.forEach(id => {
    const r = ruleMap.get(id);
    if (!r) return;

    Object.entries(r.effects).forEach(([d, val]) => {
      const dim = d as Dimension;
      if (dimScores[dim] !== undefined && val !== undefined) {
        dimScores[dim] += val;
      }
    });

    conditions.push({
      id: r.id,
      name: r.name,
      overall: r.overall,
      overallType: r.overallType,
      merits: r.merits,
      cautions: r.cautions,
      demerits: r.demerits
    });

    if (r.naiken && !seenNaiken.has(r.naiken.zh)) {
      seenNaiken.add(r.naiken.zh);
      naiken.push({ name: r.name, text: r.naiken });
    }
  });

  // Calculate 6 Dimension Ratings with TRANSPARENT REASONS (評分理由)
  const tier1: DimensionScore[] = DIMENSIONS.map(({ key, label }) => {
    let s = dimScores[key];
    let symbol: RatingSymbol = '○';
    let reasonZh = "";
    let reasonJa = "";

    if (key === 'location') {
      if (s >= 3.0 || (matchedIds.includes('walk_5') && matchedIds.includes('walk_multi_station'))) {
        symbol = '◎';
        reasonZh = "徒歩5分內近車站，且能使用多條鐵道路線甚至大型樞紐站，通勤通達極具優勢。";
        reasonJa = "駅徒歩5分圏内で複数路線・主要ターミナルが利用可能。都心アクセスが極めて優秀。";
      } else if (s >= 0.5) {
        symbol = '○';
        reasonZh = "車站步行距離適中，日常大眾運輸通勤實用性佳。";
        reasonJa = "最寄駅への徒歩分数が標準的で日常通勤に実用的。";
      } else {
        symbol = '△';
        reasonZh = "距離車站步行稍遠，雨雪天或夜間出行需注意往返負擔。";
        reasonJa = "駅までやや距離があり、悪天候時の移動に留意が必要。";
      }
    } else if (key === 'rent') {
      if (!isVacant) {
        symbol = 'N/A';
        reasonZh = "目前全棟滿室，暫無公開招租中房間與即時租金資料。";
        reasonJa = "現在満室のため募集中の部屋および賃料データなし。";
      } else if (s >= 1.5) {
        symbol = '◎';
        reasonZh = "同地段與同面積下租金明顯低於周邊行情，性價比突出。";
        reasonJa = "周辺相場に比べて割安感があり、コストパフォーマンスが高い。";
      } else if (s >= 0) {
        symbol = '○';
        reasonZh = "租金水準符合地段市場行情，因屋齡或條件已具適度折價。";
        reasonJa = "エリア相場に照らして条件相応の妥当な家賃設定。";
      } else {
        symbol = '△';
        reasonZh = "租金處於同條件中偏高水準，需權衡預算分配。";
        reasonJa = "条件に対して家賃がやや高めの水準。";
      }
    } else if (key === 'sunlight') {
      if (matchedIds.includes('orientation_south')) {
        symbol = '◎';
        reasonZh = "全天日照時間最長，室內明亮溫暖，曬衣採光極佳。";
        reasonJa = "南向きで終日日当たり良好、冬場も暖かく過ごしやすい。";
      } else if (matchedIds.includes('orientation_southwest')) {
        symbol = '○';
        reasonZh = "南西朝向午後採光充足、冬天傍晚溫暖；但夏季午後有西曬升溫影響，故評為標準良好。";
        reasonJa = "南西向きで午後の日照は良好。夏場の西日による室温上昇対策は必要。";
      } else if (matchedIds.includes('orientation_north')) {
        symbol = '▲';
        reasonZh = "北向直射陽光極少，冬天陰冷且衣物不易乾，需注意濕氣。";
        reasonJa = "北向きで直射日光が少なく、冬の冷え込みや湿気に注意。";
      } else {
        symbol = '○';
        reasonZh = "具備標準生活採光，無極端日照缺陷。";
        reasonJa = "日常生活に支障のない標準的な採光条件。";
      }
    } else if (key === 'building') {
      if (matchedIds.includes('age_old_quake')) {
        symbol = '△';
        reasonZh = "雖為最高抗震 SRC 結構，但建於 1978 年（舊耐震法規前），共用管線老化且抗震係數較現代低，嚴格評為 △ 需妥協。";
        reasonJa = "強固なSRC造ですが、1978年築（旧耐震基準）のため配管老朽化や耐震面で妥協が必要。";
      } else if (matchedIds.includes('structure_src') || matchedIds.includes('structure_rc')) {
        symbol = '◎';
        reasonZh = "鋼筋混凝土（RC/SRC）結構，耐震、耐火與遮音性能優異。";
        reasonJa = "RC/SRC造で耐震性・耐火性・遮音性に優れる安心の構造。";
      } else if (matchedIds.includes('structure_wood')) {
        symbol = '▲';
        reasonZh = "木造結構隔音較弱，上下樓層與相鄰戶生活音易互相干擾。";
        reasonJa = "木造のため遮音性が低く、上下左右の生活音が伝わりやすい。";
      } else {
        symbol = '△';
        reasonZh = "鐵骨結構耐震尚可，但遮音性弱於 RC 水泥隔間。";
        reasonJa = "鉄骨造で耐震性はあるが、遮音性はRC造に劣る。";
      }
    } else if (key === 'security') {
      if (matchedIds.includes('equip_no_autolock')) {
        symbol = '△';
        reasonZh = "大樓無自動門禁系統（無オートロック），外人可直達各戶房門前，需依賴門鎖與對講機防護。";
        reasonJa = "オートロックがないため部外者が玄関前まで立ち入れる点に防犯上の留意が必要。";
      } else if (matchedIds.includes('equip_autolock')) {
        symbol = '◎';
        reasonZh = "配備自動門禁門鎖與防犯系統，有效阻絕可疑外人進入共用走廊。";
        reasonJa = "オートロック完備で不審者の侵入を防止し防犯性が高い。";
      } else {
        symbol = '○';
        reasonZh = "具備常規防盜條件，日常出入維持基礎安全。";
        reasonJa = "一般的な防犯水準が確保されています。";
      }
    } else { // quietness
      if (matchedIds.includes('env_main_road') || matchedIds.includes('env_railway')) {
        symbol = '△';
        reasonZh = "建築結構遮音佳，但鄰近大馬路幹道或軌道，關窗時仍需注意車流與突發警笛噪音。";
        reasonJa = "構造の遮音性は高いものの、幹線道路沿いのため走行音や緊急サイレン音に留意。";
      } else {
        symbol = '○';
        reasonZh = "周邊環境屬於正常住宅安靜水準，生活噪音干擾少。";
        reasonJa = "閑静な住環境で、突発的な騒音リスクが少なめ。";
      }
    }

    return { 
      key, 
      label, 
      symbol, 
      score: s,
      reason: { zh: reasonZh, ja: reasonJa }
    };
  });

  return { 
    tier1, 
    conditions, 
    stations, 
    amenities,
    naiken,
    isVacant,
    coordinates
  };
}
