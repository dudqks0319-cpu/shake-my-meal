import { APP_CONFIG } from '@/src/config/app-config';
import type { MealIntent, MenuCategory } from '@/src/domain/menu-types';
import { categoryLabels, mealIntentLabels } from '@/src/domain/menu-types';

export function buildShareText({
  menuName,
  intensityPercent,
  category,
  intent,
}: {
  menuName: string;
  intensityPercent: number;
  category: MenuCategory;
  intent?: MealIntent;
}) {
  const reason = intent
    ? `${mealIntentLabels[intent]} 모드에서 골랐어요.`
    : `흔들기 강도 ${Math.round(intensityPercent)}%로 골랐어요.`;
  return `오늘의 메뉴는 ${menuName}! ${reason} 카테고리 ${categoryLabels[category]}. 흔들밥으로 골랐어. ${APP_CONFIG.githubRepoUrl}`;
}
