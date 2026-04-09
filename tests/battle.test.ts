import { describe, expect, it } from 'vitest';

import { resolveBattleWinner } from '@/src/domain/battle';

describe('resolveBattleWinner', () => {
  it('returns player two when player two has higher intensity', () => {
    expect(resolveBattleWinner(33, 67)).toEqual({ winner: 'player2', winningIntensity: 67 });
  });
});
