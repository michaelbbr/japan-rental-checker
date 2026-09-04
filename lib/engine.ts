import { RULES } from './rules';
import { 
  EvaluationResult, 
  Dimension, 
  RatingSymbol, 
  DimensionScore, 
  ConditionCard, 
  NaikenItem,
  StationDetail,
  WardAnalysis,
  DiningSpot,
  Supermarket,
  LayoutAnalysis,
  AreaImpression,
  InitialCostEstimate
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
  wardAnalysis: WardAnalysis,
  diningGuide: DiningSpot[],
  supermarkets: Supermarket[],
  layoutAnalysis?: LayoutAnalysis,
  areaImpression?: AreaImpression,
  initialCost?: InitialCostEstimate
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

  // Strict Thresholds & Reality Caps (嚴格校準，絕不濫發雙圈◎)
  const tier1: DimensionScore[] = DIMENSIONS.map(({ key, label }) => {
    let s = dimScores[key];
    let symbol: RatingSymbol = '○';

    if (key === 'building' && matchedIds.includes('age_old_quake')) {
      // 舊耐震48年老屋：建物評級強制封頂在 △，不可給 ◎ 或 ○
      symbol = '△';
    } else if (key === 'security' && matchedIds.includes('equip_no_autolock')) {
      // 無門禁大門：防犯強制封頂在 ○，不可給 ◎
      symbol = s > 0 ? '○' : '△';
    } else if (key === 'location') {
      // 立地：徒步5分內 + 複数路線利用可 -> ◎
      if (s >= 3.0 || (matchedIds.includes('walk_5') && matchedIds.includes('walk_multi_station'))) {
        symbol = '◎';
      } else if (s >= 0.5) {
        symbol = '○';
      } else if (s >= -1.0) {
        symbol = '△';
      } else {
        symbol = '▲';
      }
    } else {
      if (s >= 2.0) symbol = '◎';
      else if (s >= 0.5) symbol = '○';
      else if (s >= -1.0) symbol = '△';
      else symbol = '▲';
    }

    return { key, label, symbol, score: s };
  });

  return { 
    tier1, 
    conditions, 
    stations, 
    wardAnalysis,
    diningGuide,
    supermarkets,
    layoutAnalysis, 
    areaImpression, 
    initialCost, 
    naiken 
  };
}
