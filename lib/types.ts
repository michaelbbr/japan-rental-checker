export type Dimension = 'location' | 'rent' | 'sunlight' | 'building' | 'security' | 'quietness';
export type RatingSymbol = '◎' | '○' | '△' | '▲' | 'N/A';

export interface LocalizedText {
  zh: string;
  ja: string;
}

export interface Rule {
  id: string;
  name: LocalizedText;
  category: string;
  overall: { zh: string; ja: string };
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
  overall: { zh: string; ja: string };
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
  mapUrl?: string; // Google Maps walking route to station
}

export interface LifeAmenityItem {
  name: string;
  category?: string;
  tag: LocalizedText;
  priceLevel?: string;
  walk: string;
  budget?: string;
  rating?: string;
  hours?: string;
  note: LocalizedText;
  mapUrl?: string; // Google Maps walking route from property to place
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
