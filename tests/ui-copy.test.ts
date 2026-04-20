import { describe, expect, it } from 'vitest';

import { buildIntentRecommendationReason, buildRecommendationReason, getBattleStageState, getHomeHeroState } from '@/src/domain/ui-copy';

describe('ui copy helpers', () => {
  it('returns countdown copy when countdown is active', () => {
    const state = getHomeHeroState({
      countdown: 2,
      liveIntensity: 50,
      shakeStatus: 'active',
      readyForCountdown: false,
      warning: null,
      limitMessage: null,
    });

    expect(state.badge).toBe('메뉴 결정 중');
    expect(state.title).toBe('2');
  });

  it('builds a readable recommendation reason', () => {
    const text = buildRecommendationReason({
      intensityPercent: 82,
      partySize: 'duo',
      timeTag: 'dinner',
    });

    expect(text).toContain('세게 흔들어서');
    expect(text).toContain('2인 기준');
    expect(text).toContain('저녁');
  });

  it('builds a readable intent recommendation reason', () => {
    const text = buildIntentRecommendationReason({
      intentLabel: '든든하게 먹기',
      partyLabel: '혼밥',
      timeLabel: '점심',
    });

    expect(text).toContain('든든하게 먹기');
    expect(text).toContain('혼밥');
    expect(text).toContain('점심');
  });

  it('returns battle result copy on complete stage', () => {
    const state = getBattleStageState('complete');
    expect(state.badge).toBe('결과 발표');
  });
});
