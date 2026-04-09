#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <build-id>"
  exit 1
fi

BUILD_ID="$1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

WHAT_TO_TEST="${WHAT_TO_TEST:-흔들기 추천, 설정 유지, 같은 화면 배틀, 공유 동작을 확인해주세요.}"

eas submit \
  --platform ios \
  --id "$BUILD_ID" \
  --profile production \
  --what-to-test "$WHAT_TO_TEST" \
  --wait
