import { describe, expect, it } from 'vitest';

import { appendHistory } from '@/src/services/history-storage';

describe('appendHistory', () => {
  it('prepends new history items', () => {
    const result = appendHistory(
      [
        { id: '1', menuId: '1', menuName: '김밥', emoji: '🍙', intensityPercent: 20, createdAt: new Date().toISOString(), mode: 'single' },
      ],
      { id: '2', menuId: '2', menuName: '돈까스', emoji: '🍛', intensityPercent: 60, createdAt: new Date().toISOString(), mode: 'single' }
    );

    expect(result[0].id).toBe('2');
  });
});
