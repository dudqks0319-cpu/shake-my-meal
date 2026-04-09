# ShakeMyMeal Release Checklist

## Build / Verification

- [x] `npm test`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run export:web`
- [x] `expo prebuild --platform ios`
- [x] iOS simulator native build succeeded
- [x] app launch verified in simulator via direct `simctl launch`

## Product Readiness

- [x] onboarding
- [x] shake recommendation flow
- [x] settings persistence
- [x] local history
- [x] same-screen battle mode
- [x] system share
- [x] image share card fallback path
- [x] loading and error states for key settings/history/result flows
- [x] privacy policy asset drafted
- [x] menu dataset expansion toward launch target
- [ ] final UX tuning on real devices

## App Store / TestFlight

- [x] bundle identifier set
- [x] EAS project linked
- [x] `ITSAppUsesNonExemptEncryption=false`
- [x] `NSMotionUsageDescription` set
- [x] Apple signing credentials available
- [x] App Store provisioning profile created
- [x] EAS production build created and queued
- [ ] App Store build finished on EAS
- [ ] TestFlight upload completed
- [ ] Privacy Policy URL published live

## Current Blocking Items

1. EAS production build is queued on Free tier and has not finished yet.
2. Release smoke test succeeded at simulator launch level, but real device shake tuning still needs validation.
3. Privacy policy HTML exists, but GitHub Pages or another public host must serve it at a live URL.
