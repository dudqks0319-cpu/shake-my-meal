import { describe, expect, it } from 'vitest';

import { menuDataset } from '@/src/data/menu-dataset';

describe('menu dataset integrity', () => {
  it('keeps menu names unique', () => {
    const uniqueNames = new Set(menuDataset.map((item) => item.name));
    expect(uniqueNames.size).toBe(menuDataset.length);
  });

  it('keeps menu ids unique', () => {
    const uniqueIds = new Set(menuDataset.map((item) => item.id));
    expect(uniqueIds.size).toBe(menuDataset.length);
  });

  it('contains enough menu variety for a delivery-app-like catalog', () => {
    const categories = new Set(menuDataset.map((item) => item.category));
    expect(menuDataset.length).toBeGreaterThanOrEqual(200);
    expect(categories.size).toBeGreaterThanOrEqual(12);
  });

  it('keeps band distribution reasonably balanced', () => {
    const counts = menuDataset.reduce(
      (acc, item) => {
        acc[item.intensityBand] += 1;
        return acc;
      },
      { light: 0, medium: 0, heavy: 0 }
    );

    expect(counts.light).toBeGreaterThanOrEqual(80);
    expect(counts.medium).toBeGreaterThanOrEqual(100);
    expect(counts.heavy).toBeGreaterThanOrEqual(70);
  });

  it('covers breakfast, lunch, dinner, and late-night use cases', () => {
    const timeCounts = menuDataset.reduce(
      (acc, item) => {
        item.timeTags.forEach((tag) => {
          acc[tag] += 1;
        });
        return acc;
      },
      { breakfast: 0, lunch: 0, dinner: 0, 'late-night': 0 }
    );

    expect(timeCounts.breakfast).toBeGreaterThanOrEqual(10);
    expect(timeCounts.lunch).toBeGreaterThanOrEqual(60);
    expect(timeCounts.dinner).toBeGreaterThanOrEqual(70);
    expect(timeCounts['late-night']).toBeGreaterThanOrEqual(15);
  });

  it('keeps enough duo and group options for shared meals', () => {
    const servingCounts = menuDataset.reduce(
      (acc, item) => {
        item.servingTags.forEach((tag) => {
          acc[tag] += 1;
        });
        return acc;
      },
      { solo: 0, duo: 0, group: 0 }
    );

    expect(servingCounts.solo).toBeGreaterThanOrEqual(50);
    expect(servingCounts.duo).toBeGreaterThanOrEqual(70);
    expect(servingCounts.group).toBeGreaterThanOrEqual(30);
  });
});
