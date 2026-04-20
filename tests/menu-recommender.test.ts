import { describe, expect, it } from 'vitest';

import { recommendMenuByIntent } from '@/src/domain/menu-recommender';

describe('recommendMenuByIntent', () => {
  it('picks light menus for light intent first', () => {
    const result = recommendMenuByIntent({
      intent: 'light',
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

  it('falls back to the next available pool when the preferred band is empty', () => {
    const result = recommendMenuByIntent({
      intent: 'treat',
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
