# 흔들밥 (ShakeMyMeal)

폰을 흔들어서 오늘 먹을 메뉴를 고르는 오프라인 모바일 앱 MVP입니다.

## 현재 구현 범위

- 온보딩 3장
- 메인 흔들기 화면
- 강도 게이지 표시
- 오프라인 메뉴 추천
- 결과 카드와 시스템 공유
- 설정 저장
- 최근 기록 저장
- 같은 화면 배틀 화면

## 실행

```bash
npm install
npm run web
```

모바일 기기에서 확인하려면:

```bash
npm run ios
npm run android
```

## 검증

```bash
npm test
npm run typecheck
npm run lint
npm run export:web
```

## iOS / TestFlight

원격 iOS 빌드 및 TestFlight 제출 관련 문서는 아래를 참고합니다.

- 런북: `docs/testflight-runbook.md`
- 스토어 메타데이터 초안: `docs/store-metadata.md`
- 릴리즈 체크리스트: `docs/release-checklist.md`

상태 확인용 스크립트:

```bash
bash scripts/check_ios_build_status.sh <build-id>
```

## 현재 제한

- 배틀 모드는 블루투스가 아닌 같은 화면 순차 모드 기준
- 카카오/인스타 전용 연동 없음
- 결제/광고는 구조만 준비하고 실제 SDK는 미연동
- 센서 품질은 실제 기기별 튜닝이 추가로 필요
