import type { IngredientTag, MenuItem, TasteTag } from '@/src/domain/menu-types';

export function getDerivedTasteTags(menu: MenuItem): TasteTag[] {
  if (menu.tasteTags?.length) {
    return menu.tasteTags;
  }

  const tags: TasteTag[] = [];
  const name = menu.name;

  if (/마라|짬뽕|떡볶이|라볶이|제육|비빔|낙곱새|오징어|훠궈/.test(name)) {
    tags.push('spicy');
  }
  if (/샐러드|쌀국수|소바|냉면|반미/.test(name)) {
    tags.push('fresh');
  }
  if (/빙수|크로플|와플|티라미수|젤라또|아포가토|허니/.test(name)) {
    tags.push('sweet');
  }
  if (/튀김|치킨|탕수육|돈까스|버거|피자|핫도그|윙/.test(name)) {
    tags.push('greasy');
  }

  tags.push(menu.intensityBand === 'light' ? 'clean' : 'savory');
  return Array.from(new Set(tags));
}

export function getDerivedIngredientTags(menu: MenuItem): IngredientTag[] {
  if (menu.ingredientTags?.length) {
    return menu.ingredientTags;
  }

  const tags: IngredientTag[] = [];
  const name = menu.name;

  if (/마라|짬뽕|떡볶이|라볶이|제육|비빔|낙곱새|훠궈/.test(name)) {
    tags.push('spicy-food');
  }
  if (/회|초밥|게장|해물|오징어|푸팟퐁|피시/.test(name)) {
    tags.push('seafood');
  }
  if (/삼겹살|보쌈|돈까스|제육|탕수육|핫도그|버팔로/.test(name)) {
    tags.push('pork');
  }
  if (/한우|갈비|스테이크|불고기|양갈비|토마호크/.test(name)) {
    tags.push('beef');
  }
  if (/마늘|알리오/.test(name)) {
    tags.push('garlic');
  }

  return Array.from(new Set(tags));
}
