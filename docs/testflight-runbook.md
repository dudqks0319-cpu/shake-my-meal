# ShakeMyMeal TestFlight Runbook

## 목적

`shake-my-meal` 앱을 EAS iOS production build -> App Store Connect -> TestFlight 순서로 올릴 때 필요한 실제 절차를 정리한다.

## 현재 기준 정보

- Expo project: `@jyb1126/shake-my-meal`
- bundle id: `com.jyb1126.shakemymeal`
- latest known iOS build id: `1543819f-8b57-49e5-9c08-2e5b5529ea31`

## 1. 원격 빌드 상태 확인

```bash
eas build:view <build-id> --json
eas build:list --platform ios --limit 5
```

확인 포인트:
- `status`
- `artifacts.buildUrl`
- `appBuildVersion`

## 2. 빌드 완료 후 TestFlight 제출

```bash
eas submit --platform ios --id <build-id> --profile production --wait
```

선택 옵션:

```bash
eas submit \
  --platform ios \
  --id <build-id> \
  --profile production \
  --what-to-test "흔들기 추천, 설정 유지, 같은 화면 배틀, 공유 동작을 확인해주세요." \
  --wait
```

## 3. App Store Connect 확인 항목

- TestFlight 빌드 처리 상태
- 내부 테스터 그룹 배포 여부
- `What to Test` 문구 반영 여부
- Export compliance 항목
- Privacy / Age Rating / App Information 누락 항목

## 4. 내부 QA 체크

- 온보딩 진입
- 메인 흔들기 -> 결과
- 설정 저장 복원
- 배틀 흐름
- 공유 시트
- 센서 약할 때 재시도 문구

## 5. 자주 막히는 지점

- Apple 세션 만료
- provisioning profile 만료
- App Store Connect 메타데이터 미완성
- Free tier EAS queue 대기
- Expo dev client 링크가 앱 launch를 가로채는 현상

## 6. 현재 알려진 상태

- 자격 증명 생성 완료
- App Store provisioning profile 생성 완료
- production build는 큐 대기 상태를 경험함
- 실제 완료 여부는 `eas build:view`로 다시 확인 필요
