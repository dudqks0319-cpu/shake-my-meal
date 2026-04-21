# Local-First Redesign Design

## Goal

이미지 레퍼런스의 10개 화면 흐름을 `흔들밥` 앱에 반영하되, 로그인과 서버 백엔드 없이 가벼운 로컬 앱으로 유지한다.

## Product Direction

- 앱은 “가볍게 설치해서 바로 메뉴 추천받는 앱”이어야 한다.
- 흔들기는 추천 결과를 정하는 복잡한 센서 알고리즘이 아니라, 재미있는 추첨 연출이다.
- 핵심 데이터는 모두 기기 내부에 저장한다.
- 서버, 계정, 결제, 광고는 v1에서 제외한다.

## Scope

### Included

- 홈 추천 결과 중심 UI
- 카테고리 선택 화면
- 추천 기록 화면
- 찜 목록 화면
- 설정 화면
- 흔들기 안내 화면
- 필터 설정 화면
- 결과 공유 화면
- 빈 결과 화면
- 로컬 저장 기반 찜/기록/필터/설정

### Excluded

- 로그인
- 원격 서버
- 원격 DB
- 배달앱 제휴 API
- 결제/광고 SDK

## Local Data Model

### Menu

기존 `MenuItem`을 확장해 맛/재료/가격/이미지형 표현을 담는다.

- `tasteTags`: 매운맛, 담백한맛, 고소한맛, 새콤한맛, 달콤한맛
- `ingredientTags`: 매운 음식, 고수, 해산물, 버섯, 양파, 마늘, 햄/베이컨
- `imageTone`: 이미지가 없을 때 카드 배경을 정하는 visual token

### Local Stores

- `favorites`: 찜한 메뉴 id 목록
- `history`: 추천 기록
- `filterSettings`: 제외 재료, 선호 맛, 가격대
- `appSettings`: 진동, 효과음, 민감도, 자동 시간대

## Screen Design

### Splash

- 크림 배경
- 흔들리는 밥그릇 캐릭터
- 1초 내 홈으로 전환

### Home

- 상단 설정 버튼
- “흔들밥” 브랜드
- 의도 선택 + 흔들기 CTA
- 오늘 추천 카드
- 하단 탭: 홈 / 카테고리 / 찜 목록

### Category

- 2열 카테고리 카드
- 선택된 카테고리 강조
- 하단 CTA: `이 카테고리로 추천받기`

### History

- 날짜별 추천 기록
- 찜 토글
- 기록 전체 삭제

### Favorites

- 찜한 메뉴 카드 리스트
- 빈 상태 제공

### Settings

- 흔들기 민감도
- 효과음/진동
- 제외 메뉴
- 필터 설정
- 흔들기 안내
- 버전 정보

### Shake Guide

- 흔드는 방법 설명
- 센서가 불안정하면 버튼 추천도 가능하다는 안내

### Filter Settings

- 제외 재료
- 선호 맛
- 가격대
- 저장 CTA

### Share

- 결과 카드
- Kakao/Instagram/Facebook처럼 보이는 공유 액션
- 이미지 저장 CTA

### Empty State

- 추천 결과가 없을 때 필터 변경 CTA
- 전체 메뉴 랜덤 CTA

## Recommendation Logic

1. 기본 풀: 전체 메뉴
2. 카테고리 필터 적용
3. 제외 메뉴와 제외 재료 제거
4. 인원수/시간대/맛 태그 반영
5. 의도 기반 우선순위 적용
6. 후보가 없으면 단계적 완화
7. 최종 후보에서 랜덤 선택

## Backend Strategy

서버 백엔드는 만들지 않는다. 대신 로컬 서비스 레이어를 백엔드처럼 분리한다.

- `src/services/favorites-storage.ts`
- `src/services/filter-storage.ts`
- `src/services/history-storage.ts`
- `src/services/settings-storage.ts`

## Acceptance Criteria

- 앱이 오프라인에서 동작한다.
- 찜/기록/필터/설정이 앱 재실행 후 유지된다.
- 홈/카테고리/찜 목록 하단 탭이 일관된다.
- 빈 상태와 오류 상태가 있다.
- `npm test`, `npm run typecheck`, `npm run lint`가 통과한다.
