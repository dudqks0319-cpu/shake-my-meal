import { describe, expect, it } from 'vitest';

import { recommendMenu } from '@/src/domain/menu-recommender';

describe('recommendMenu', () => {
  it('maps low intensity to light menus', () => {
    const result = recommendMenu({
      intensityPercent: 20,
      menus: [
        { id: '1', name: '김밥', emoji: '🍙', intensityBand: 'light', category: 'korean', priceTier: 'budget', calories: 450, servingTags: ['solo'], timeTags: ['lunch'] },
        { id: '2', name: '삼겹살', emoji: '🥓', intensityBand: 'heavy', category: 'korean', priceTier: 'premium', calories: 900, servingTags: ['group'], timeTags: ['dinner'] },
      ],
      settings: {
        excludedMenuIds: [],
        enabledCategories: ['korean'],
        partySize: 'solo',
        autoTimeDetection: false,
        soundEnabled: true,
        hapticsEnabled: true,
        premiumUnlocked: false,
      },
      currentTimeTag: 'lunch',
      random: () => 0,
    });

    expect(result.name).toBe('김밥');
  });

  it('falls back when time filter removes every candidate', () => {
    const result = recommendMenu({
      intensityPercent: 55,
      menus: [
        { id: '1', name: '파스타', emoji: '🍝', intensityBand: 'medium', category: 'western', priceTier: 'standard', calories: 650, servingTags: ['solo'], timeTags: ['dinner'] },
      ],
      settings: {
        excludedMenuIds: [],
        enabledCategories: ['western'],
        partySize: 'solo',
        autoTimeDetection: false,
        soundEnabled: true,
        hapticsEnabled: true,
        premiumUnlocked: false,
      },
      currentTimeTag: 'lunch',
      random: () => 0,
    });

    expect(result.name).toBe('파스타');
  });
});
