import { RULES } from './rules';
import { EvaluationResult, Dimension, RatingSymbol, DimensionScore, BulletItem, NaikenItem } from './types';

const DIMENSIONS: Array<{ key: Dimension; label: string }> = [
  { key: "location", label: "立地" },
  { key: "rent", label: "家賃" },
  { key: "sunlight", label: "日当たり" },
  { key: "building", label: "建物" },
  { key: "security", label: "防犯" },
  { key: "quietness", label: "静かさ" }
];

export function evaluateProperty(matchedIds: string[]): EvaluationResult {
  const dimScores: Record<Dimension, number> = {
    location: 0,
    rent: 0,
    sunlight: 0,
    building: 0,
    security: 0,
    quietness: 0
  };

  const merits: BulletItem[] = [];
  const cautions: BulletItem[] = [];
  const demerits: BulletItem[] = [];
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

    if (r.bullets.merit) merits.push({ name: r.name, text: r.bullets.merit });
    if (r.bullets.caution) cautions.push({ name: r.name, text: r.bullets.caution });
    if (r.bullets.demerit) demerits.push({ name: r.name, text: r.bullets.demerit });

    if (r.naiken && !seenNaiken.has(r.naiken)) {
      seenNaiken.add(r.naiken);
      naiken.push({ name: r.name, text: r.naiken });
    }
  });

  const tier1: DimensionScore[] = DIMENSIONS.map(({ key, label }) => {
    const s = dimScores[key];
    let symbol: RatingSymbol = '○';
    if (s >= 1.5) symbol = '◎';
    else if (s >= 0) symbol = '○';
    else if (s >= -1.5) symbol = '△';
    else symbol = '▲';

    return { key, label, symbol, score: s };
  });

  return { tier1, merits, cautions, demerits, naiken };
}
