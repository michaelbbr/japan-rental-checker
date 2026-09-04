export type Dimension = 'location' | 'rent' | 'sunlight' | 'building' | 'security' | 'quietness';
export type RatingSymbol = '◎' | '○' | '△' | '▲' | 'N/A';
export type Language = 'ja' | 'zh' | 'zhCN' | 'en';

export interface LocalizedText {
  ja: string;
  zh: string;    // 繁體中文
  zhCN: string;  // 简体中文
  en: string;    // English
}

export interface Rule {
  id: string;
  name: LocalizedText;
  category: string;
  overall: LocalizedText;
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
  reason: LocalizedText;
}

export interface ConditionCard {
  id: string;
  name: LocalizedText;
  overall: LocalizedText;
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
  mapUrl?: string;
}

export interface LifeAmenityItem {
  name: string;
  category?: string;
  tag: LocalizedText;
  priceLevel?: LocalizedText;
  walk: string;
  budget?: string;
  rating?: string;
  hours?: string;
  note: LocalizedText;
  mapUrl?: string;
}

export interface EvaluationResult {
  tier1: DimensionScore[];
  conditions: ConditionCard[];
  stations: StationDetail[];
  amenities: {
    supermarkets: LifeAmenityItem[];
    convenienceStores: LifeAmenityItem[];
    famousChains: LifeAmenityItem[];
    isGoogleMapsLive?: boolean;
  };
  naiken: NaikenItem[];
  isVacant: boolean;
  coordinates?: { lat: number; lng: number };
}
