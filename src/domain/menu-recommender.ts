import type { IntensityBand, MealIntent, MenuItem, TimeTag, UserSettings } from '@/src/domain/menu-types';
import type { FilterSettings } from '@/src/services/filter-storage';
import { getDerivedIngredientTags, getDerivedTasteTags } from '@/src/domain/menu-tags';

function getIntensityBand(intensityPercent: number): IntensityBand {
  if (intensityPercent <= 30) {
    return 'light';
  }
  if (intensityPercent <= 70) {
    return 'medium';
  }
  return 'heavy';
}

export function getCurrentTimeTag(date = new Date()): TimeTag {
  const hour = date.getHours();

  if (hour < 11) {
    return 'breakfast';
  }
  if (hour < 16) {
    return 'lunch';
  }
  if (hour < 22) {
    return 'dinner';
  }
  return 'late-night';
}

type RecommendMenuInput = {
  intensityPercent: number;
  menus: MenuItem[];
  settings: UserSettings;
  currentTimeTag: TimeTag;
  random?: () => number;
};

type RecommendMenuByIntentInput = {
  intent: MealIntent;
  menus: MenuItem[];
  settings: UserSettings;
  currentTimeTag: TimeTag;
  filters?: FilterSettings;
  random?: () => number;
};

function chooseRandomMenu(menus: MenuItem[], random = Math.random) {
  const index = Math.floor(random() * menus.length);
  return menus[index];
}

function filterMenus({
  menus,
  settings,
  currentTimeTag,
  filters,
}: {
  menus: MenuItem[];
  settings: UserSettings;
  currentTimeTag: TimeTag;
  filters?: FilterSettings;
}) {
  const byCategory = menus.filter((menu) => settings.enabledCategories.includes(menu.category));
  const byExclusion = byCategory.filter((menu) => !settings.excludedMenuIds.includes(menu.id));
  const byPrice = filters
    ? byExclusion.filter((menu) => filters.priceTiers.includes(menu.priceTier))
    : byExclusion;
  const byIngredient = filters
    ? byPrice.filter((menu) => !getDerivedIngredientTags(menu).some((tag) => filters.excludedIngredients.includes(tag)))
    : byPrice;
  const byTaste = filters && filters.preferredTastes.length > 0
    ? byIngredient.filter((menu) => getDerivedTasteTags(menu).some((tag) => filters.preferredTastes.includes(tag)))
    : byIngredient;
  const byPartySize = byTaste.filter((menu) => menu.servingTags.includes(settings.partySize));
  const byTime = byPartySize.filter((menu) => menu.timeTags.includes(currentTimeTag));

  return {
    byCategory,
    byExclusion,
    byPrice,
    byIngredient,
    byTaste,
    byPartySize,
    byTime,
  };
}

export function recommendMenu({
  intensityPercent,
  menus,
  settings,
  currentTimeTag,
  random = Math.random,
}: RecommendMenuInput) {
  const band = getIntensityBand(intensityPercent);
  const byBand = menus.filter((menu) => menu.intensityBand === band);
  const { byCategory, byExclusion, byPartySize, byTime } = filterMenus({
    menus: byBand,
    settings,
    currentTimeTag,
  });

  const fallbackPools = [byTime, byPartySize, byExclusion, byCategory, byBand, menus];
  const finalPool = fallbackPools.find((pool) => pool.length > 0);

  if (!finalPool || finalPool.length === 0) {
    throw new Error('No menus available');
  }

  return chooseRandomMenu(finalPool, random);
}

const intentBandPriority: Record<MealIntent, IntensityBand[]> = {
  light: ['light', 'medium', 'heavy'],
  full: ['medium', 'heavy', 'light'],
  treat: ['heavy', 'medium', 'light'],
};

export function recommendMenuByIntent({
  intent,
  menus,
  settings,
  currentTimeTag,
  filters,
  random = Math.random,
}: RecommendMenuByIntentInput) {
  const prioritizedBands = intentBandPriority[intent];

  for (const band of prioritizedBands) {
    const byBand = menus.filter((menu) => menu.intensityBand === band);
    const { byCategory, byExclusion, byPartySize, byTime } = filterMenus({
      menus: byBand,
      settings,
      currentTimeTag,
      filters,
    });
    const finalPool = [byTime, byPartySize, byExclusion, byCategory, byBand].find((pool) => pool.length > 0);

    if (finalPool && finalPool.length > 0) {
      return chooseRandomMenu(finalPool, random);
    }
  }

  const fallbackPool = filterMenus({
    menus,
    settings,
    currentTimeTag,
    filters,
  });
  const finalPool = [fallbackPool.byTime, fallbackPool.byPartySize, fallbackPool.byExclusion, fallbackPool.byCategory, menus]
    .find((pool) => pool.length > 0);

  if (!finalPool || finalPool.length === 0) {
    throw new Error('No menus available');
  }

  return chooseRandomMenu(finalPool, random);
}

export { getIntensityBand };
