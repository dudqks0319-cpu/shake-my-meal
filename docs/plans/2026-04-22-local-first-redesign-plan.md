# Local-First Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 이미지 레퍼런스의 핵심 모바일 UI 흐름을 `shake-my-meal`에 반영하면서 모든 상태를 로컬 저장소에 유지한다.

**Architecture:** Expo Router 화면을 추가하고, 로컬 저장소 서비스가 찜/기록/필터/설정을 관리한다. 메뉴 추천은 기존 도메인 로직을 확장해 카테고리, 맛, 재료, 가격대 필터를 반영한다.

**Tech Stack:** Expo, React Native, Expo Router, AsyncStorage, Vitest, TypeScript

---

### Task 1: Local Stores

**Files:**
- Create: `src/services/favorites-storage.ts`
- Create: `src/services/filter-storage.ts`
- Modify: `src/domain/menu-types.ts`
- Test: `tests/local-stores.test.ts`

**Steps:**
1. Write tests for favorite toggle and filter defaults.
2. Implement storage helpers with safe fallback.
3. Verify with `npm test`.

### Task 2: Navigation Shell

**Files:**
- Create: `src/components/bottom-tabs.tsx`
- Modify: `src/components/screen-shell.tsx`
- Modify screens to include bottom tabs.

**Steps:**
1. Add bottom tabs for home/category/favorites.
2. Preserve safe area and touch targets.
3. Verify with typecheck.

### Task 3: Category / History / Favorites Screens

**Files:**
- Create: `app/categories.tsx`
- Create: `app/history.tsx`
- Create: `app/favorites.tsx`
- Create: `src/screens/category-screen.tsx`
- Create: `src/screens/history-screen.tsx`
- Create: `src/screens/favorites-screen.tsx`

**Steps:**
1. Build category grid.
2. Build history list with favorite toggles.
3. Build favorite list with empty state.

### Task 4: Filter / Guide / Share Screens

**Files:**
- Create: `app/filters.tsx`
- Create: `app/guide.tsx`
- Create: `app/share.tsx`
- Create: corresponding screen files.

**Steps:**
1. Implement filters for ingredients, tastes, and price.
2. Implement guide screen.
3. Implement share screen with existing poster component.

### Task 5: Home Redesign

**Files:**
- Modify: `src/screens/home-screen.tsx`
- Modify: `src/domain/menu-recommender.ts`

**Steps:**
1. Move home toward recommendation-card-first UI.
2. Use selected category/filter intent in recommendation.
3. Add empty-result fallback route.

### Task 6: Verification

**Commands:**
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run export:web`

**Expected:** all pass.
