export type Dimension = 'location' | 'rent' | 'sunlight' | 'building' | 'security' | 'quietness';
export type RatingSymbol = '◎' | '○' | '△' | '▲';

export interface Rule {
  id: string;
  name: string;
  category: string;
  effects: Partial<Record<Dimension, number>>;
  bullets: {
    merit?: string;
    caution?: string;
    demerit?: string;
  };
  naiken?: string;
  kw: string[];
}

export interface DimensionScore {
  key: Dimension;
  label: string;
  symbol: RatingSymbol;
  score: number;
}

export interface BulletItem {
  name: string;
  text: string;
}

export interface NaikenItem {
  name: string;
  text: string;
}

export interface EvaluationResult {
  tier1: DimensionScore[];
  merits: BulletItem[];
  cautions: BulletItem[];
  demerits: BulletItem[];
  naiken: NaikenItem[];
}
