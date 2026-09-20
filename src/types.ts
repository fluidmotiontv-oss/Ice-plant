export type Season = 'summer' | 'winter';
export type Language = 'jp' | 'en';

export interface CustomizeOption {
  nameJp: string;
  nameEn: string;
  choices: {
    labelJp: string;
    labelEn: string;
    priceDeltaJpy?: number;
    default?: boolean;
  }[];
}

export interface MenuItem {
  id: string;
  nameJp: string;
  nameEn: string;
  descriptionJp: string;
  descriptionEn: string;
  priceJpy: number;
  category: 'kakigori' | 'sundae' | 'oden' | 'drink' | 'side';
  season: 'summer' | 'winter' | 'all';
  imageUrl: string;
  isSignature?: boolean;
  calories?: number;
  customizeOptions?: CustomizeOption[];
  tags: string[];
}

export interface OrderCustomization {
  [optionNameEn: string]: string;
}

export interface OrderItem {
  cartId: string;
  item: MenuItem;
  quantity: number;
  customizations: OrderCustomization;
  unitPriceJpy: number;
  totalPriceJpy: number;
  specialNotes?: string;
}

export interface Dragon9TimeState {
  jstTimeString: string;
  standardHour: number;
  standardMinute: number;
  standardSecond: number;
  dragon9Hour: number;           // 1 to 13
  dragon9Minute: number;         // 0 to 53
  dragon9Second: number;         // 0 to 59
  isApexPause: boolean;          // true during 18-min apex pauses (11:51-12:09 & 23:51-00:09)
  apexType: 'midday' | 'midnight' | null;
  apexRemainingSeconds: number;  // countdown for active apex pause
  is13thHourWedge: boolean;      // true during 13th hour open wedge
  ambientLighting: 'dawn' | 'morning' | 'midday' | 'zen_midday' | 'afternoon' | 'dusk' | 'twilight' | 'night' | 'zen_midnight';
  simulatedHourOffset: number;   // 0 to 24 for time scrubbing
  activeCycleNameJp: string;
  activeCycleNameEn: string;
}

export interface InstagramPost {
  id: string;
  username: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  mediaUrl: string;
  captionJp: string;
  captionEn: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  location: string;
  tags: string[];
}

export type MascotMood = 'happy' | 'shaving' | 'warm_oden' | 'zen' | 'excited' | 'thank_you';
