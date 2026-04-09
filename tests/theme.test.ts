import { describe, expect, it } from 'vitest';

import { theme } from '@/src/styles/theme';

describe('theme', () => {
  it('exposes required color tokens', () => {
    expect(theme.colors.canvas).toBeDefined();
    expect(theme.colors.bowl).toBeDefined();
    expect(theme.colors.ink).toBeDefined();
  });
});
