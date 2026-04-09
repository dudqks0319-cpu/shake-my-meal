# ShakeMyMeal Manual QA

## 1. First Launch

- 앱 첫 실행 시 온보딩이 바로 보인다.
- 3장의 슬라이드를 모두 넘길 수 있다.
- `배고파, 시작하자!` 버튼 후 메인 화면으로 이동한다.

## 2. Main Shake Flow

- 메인 화면 진입 후 브랜드/게이지/빠른 액션이 보인다.
- 실제 흔들기 시 강도 게이지가 상승한다.
- 너무 약하게 흔들면 `조금 더 세게, 다시!` 경로가 나온다.
- 충분히 흔들면 3초 카운트다운 후 결과 화면으로 이동한다.

## 3. Result

- 결과 카드에 메뉴명, 가격, 카테고리, 칼로리가 나온다.
- 추천 이유 카드가 보인다.
- `다시 흔들기`가 홈으로 복귀한다.
- 이미지 카드 공유가 가능하거나, 실패 시 텍스트 공유로 폴백된다.

## 4. Settings

- 카테고리 필터를 껐다 켜면 추천 풀에 반영된다.
- `NO 리스트` 메뉴 선택이 저장된다.
- 재실행 후에도 설정이 유지된다.
- `진동` 옵션을 끄면 결과/카운트다운 햅틱이 꺼진다.
- 설정 저장 실패 시 에러 안내가 보인다.

## 5. Battle

- `1P 시작` 후 첫 번째 흔들기 측정이 시작된다.
- 1P 점수가 저장되면 `2P 시작` 버튼이 나온다.
- 2P까지 완료되면 승자 결과 카드가 나온다.
- 약한 흔들기인 경우 해당 플레이어만 재시도한다.

## 6. Error / Edge Cases

- 센서 미지원 환경에서 앱이 죽지 않고 안내 문구를 보여준다.
- 설정/기록 로딩 실패 시 안내 카드가 보인다.
- 공유 카드 생성 실패 시 텍스트 공유로 폴백된다.
- 설정에서 모든 카테고리를 끄더라도 앱이 죽지 않고 폴백 추천이 가능하다.

## 7. iOS Release Smoke

- iPhone simulator native build succeeds
- app launches from simulator without build error
- motion permission prompt or fallback behavior is understandable

## 8. Android Release Smoke

- Android emulator or device boots app
- main flow renders without layout overflow
- share action does not crash
