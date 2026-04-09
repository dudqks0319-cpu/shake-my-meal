#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <build-id>"
  exit 1
fi

BUILD_ID="$1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

WHAT_TO_TEST="흔들기 추천, 설정 유지, 같은 화면 배틀, 공유 동작을 확인해주세요."
timestamp() {
  date +"%Y-%m-%dT%H:%M:%S%z"
}

echo "[$(timestamp)] Watching EAS build $BUILD_ID"

while true; do
  JSON_OUTPUT="$(eas build:view "$BUILD_ID" --json 2>/dev/null || true)"

  if [ -z "$JSON_OUTPUT" ]; then
    echo "[$(timestamp)] build:view returned empty output, retrying in 300s"
    sleep 300
    continue
  fi

  STATUS="$(python3 - <<'PY' "$JSON_OUTPUT"
import json, sys
data = json.loads(sys.argv[1])
print(data.get("status", "UNKNOWN"))
PY
)"

  echo "[$(timestamp)] Current status: $STATUS"

  case "$STATUS" in
    FINISHED)
      echo "[$(timestamp)] Build finished. Starting TestFlight submit."
      eas submit \
        --platform ios \
        --id "$BUILD_ID" \
        --profile production \
        --wait \
        --non-interactive \
        --what-to-test "$WHAT_TO_TEST"
      echo "[$(timestamp)] Submit command finished."
      exit 0
      ;;
    ERRORED|CANCELED)
      echo "[$(timestamp)] Build ended with status $STATUS"
      exit 1
      ;;
    *)
      sleep 300
      ;;
  esac
done
