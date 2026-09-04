export type Dimension = 'location' | 'rent' | 'sunlight' | 'building' | 'security' | 'quietness';
export type RatingSymbol = '◎' | '○' | '△' | '▲';

export type ConditionOverall = {
  zh: '◎ 明顯優點' | '○ 加分條件' | '△ 中性/看習慣' | '⚠️ 需妥協' | '👎 明顯抗性';
  ja: '◎ 明確な強み' | '○ 加点条件' | '△ 普通・好みによる' | '⚠️ 妥協・注意' | '👎 明確な弱点';
};

export interface LocalizedText {
  zh: string;
  ja: string;
}

export interface Rule {
  id: string;
  name: LocalizedText;
  category: string;
  overall: ConditionOverall;
  overallType: 'positive' | 'neutral' | 'negative';
  effects: Partial<Record<Dimension, number>>;
  merits: LocalizedText[];
  cautions: LocalizedText[];
  demerits: LocalizedText[];
  naiken?: LocalizedText;
}

export interface DimensionScore {
  key: Dimension;
  label: LocalizedText;
  symbol: RatingSymbol;
  score: number;
}

export interface ConditionCard {
  id: string;
  name: LocalizedText;
  overall: ConditionOverall;
  overallType: 'positive' | 'neutral' | 'negative';
  merits: LocalizedText[];
  cautions: LocalizedText[];
  demerits: LocalizedText[];
}

export interface NaikenItem {
  name: LocalizedText;
  text: LocalizedText;
}

export interface StationDetail {
  line: string;
  station: string;
  walkMin: number;
  fullText: string;
  destinations: LocalizedText;
  pitfalls: LocalizedText;
}

export interface WardAnalysis {
  wardName: LocalizedText;
  summary: LocalizedText;
  pros: LocalizedText[];
  cons: LocalizedText[];
}

export interface FamousChainItem {
  name: string;
  brandType: LocalizedText; // e.g. "牛丼" / "平價速食" / "家庭餐廳" / "平價拉麵" / "連鎖咖啡"
  walk: string;
  budget: string;
  feature: LocalizedText;
}

export interface FamousChainGroup {
  categoryName: LocalizedText;
  chains: FamousChainItem[];
}

export interface ConvenienceStoreGuide {
  brandName: string;
  tier: LocalizedText;      // e.g. "平價省錢型" / "標準三大超商" / "高檔精品型"
  priceLevel: string;       // e.g. "★☆☆☆☆ (極便宜)" / "★★★☆☆ (標準)" / "★★★★☆ (偏高)"
  features: LocalizedText;
  bestFor: LocalizedText;
  isNearby: boolean;
  distance: string;
}

export interface Supermarket {
  name: string;
  positioning: LocalizedText;
  rating: string;
  walk: string;
  hours: string;
  comment: LocalizedText;
}

export interface LayoutAnalysis {
  type: string;
  area: string;
  comment: LocalizedText;
  tips: LocalizedText[];
}

export interface AreaImpression {
  areaName: string;
  summary: LocalizedText;
  safety: LocalizedText;
  convenience: LocalizedText;
  environment: LocalizedText;
}

export interface InitialCostEstimate {
  rent: number;
  managementFee: number;
  totalEstimate: string;
  items: Array<{ name: LocalizedText; amount: string }>;
}

export interface EvaluationResult {
  tier1: DimensionScore[];
  conditions: ConditionCard[];
  stations: StationDetail[];
  wardAnalysis: WardAnalysis;
  famousChains: FamousChainGroup[];
  convenienceStores: ConvenienceStoreGuide[];
  supermarkets: Supermarket[];
  layoutAnalysis?: LayoutAnalysis;
  areaImpression?: AreaImpression;
  initialCost?: InitialCostEstimate;
  naiken: NaikenItem[];
}
