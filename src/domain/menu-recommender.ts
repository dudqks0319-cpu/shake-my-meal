import type { IntensityBand, MenuItem, TimeTag, UserSettings } from '@/src/domain/menu-types';

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

function chooseRandomMenu(menus: MenuItem[], random = Math.random) {
  const index = Math.floor(random() * menus.length);
  return menus[index];
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
  const byCategory = byBand.filter((menu) => settings.enabledCategories.includes(menu.category));
  const byExclusion = byCategory.filter((menu) => !settings.excludedMenuIds.includes(menu.id));
  const byPartySize = byExclusion.filter((menu) => menu.servingTags.includes(settings.partySize));
  const byTime = byPartySize.filter((menu) => menu.timeTags.includes(currentTimeTag));

  const fallbackPools = [byTime, byPartySize, byExclusion, byCategory, byBand, menus];
  const finalPool = fallbackPools.find((pool) => pool.length > 0);

  if (!finalPool || finalPool.length === 0) {
    throw new Error('No menus available');
  }

  return chooseRandomMenu(finalPool, random);
}

export { getIntensityBand };
