export type Dimension = 'location' | 'rent' | 'sunlight' | 'building' | 'security' | 'quietness';
export type RatingSymbol = '◎' | '○' | '△' | '▲';

export type ConditionOverall = '◎ 明顯優點' | '○ 加分條件' | '△ 中性/看習慣' | '⚠️ 需妥協' | '👎 明顯抗性';

export interface Rule {
  id: string;
  name: string;
  category: string;
  overall: ConditionOverall;
  overallType: 'positive' | 'neutral' | 'negative';
  effects: Partial<Record<Dimension, number>>;
  merits: string[];
  cautions: string[];
  demerits: string[];
  naiken?: string;
}

export interface DimensionScore {
  key: Dimension;
  label: string;
  symbol: RatingSymbol;
  score: number;
}

export interface ConditionCard {
  id: string;
  name: string;
  overall: ConditionOverall;
  overallType: 'positive' | 'neutral' | 'negative';
  merits: string[];
  cautions: string[];
  demerits: string[];
}

export interface NaikenItem {
  name: string;
  text: string;
}

export interface EvaluationResult {
  tier1: DimensionScore[];
  conditions: ConditionCard[];
  naiken: NaikenItem[];
}
