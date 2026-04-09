export type MenuCategory =
  | 'korean'
  | 'chinese'
  | 'japanese'
  | 'western'
  | 'snack'
  | 'asian'
  | 'dessert';

export type IntensityBand = 'light' | 'medium' | 'heavy';
export type PriceTier = 'budget' | 'standard' | 'premium';
export type PartySize = 'solo' | 'duo' | 'group';
export type TimeTag = 'breakfast' | 'lunch' | 'dinner' | 'late-night';

export type MenuItem = {
  id: string;
  name: string;
  emoji: string;
  category: MenuCategory;
  intensityBand: IntensityBand;
  priceTier: PriceTier;
  calories: number;
  servingTags: PartySize[];
  timeTags: TimeTag[];
};

export type UserSettings = {
  excludedMenuIds: string[];
  enabledCategories: MenuCategory[];
  partySize: PartySize;
  autoTimeDetection: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  premiumUnlocked: boolean;
};

export type ShakeHistoryItem = {
  id: string;
  menuId: string;
  menuName: string;
  emoji: string;
  intensityPercent: number;
  createdAt: string;
  mode: 'single' | 'battle';
};

export const categoryLabels: Record<MenuCategory, string> = {
  korean: '한식',
  chinese: '중식',
  japanese: '일식',
  western: '양식',
  snack: '분식',
  asian: '아시안',
  dessert: '디저트',
};

export const priceTierLabels: Record<PriceTier, string> = {
  budget: '~7천원',
  standard: '7천~1.5만원',
  premium: '1.5만원+',
};
