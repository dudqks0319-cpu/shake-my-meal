import { APP_CONFIG } from '@/src/config/app-config';
import type { MenuCategory } from '@/src/domain/menu-types';
import { categoryLabels } from '@/src/domain/menu-types';

export function buildShareText({
  menuName,
  intensityPercent,
  category,
}: {
  menuName: string;
  intensityPercent: number;
  category: MenuCategory;
}) {
  return `오늘의 메뉴는 ${menuName}! 흔들기 강도 ${Math.round(intensityPercent)}%, 카테고리 ${categoryLabels[category]}. 흔들밥으로 골랐어. ${APP_CONFIG.githubRepoUrl}`;
}
