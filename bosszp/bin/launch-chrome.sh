#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROFILE_DIR="$ROOT_DIR/profile"

CHROME_APP="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME_APP" ]; then
  echo "Chrome not found at $CHROME_APP"
  exit 1
fi

PORT=${1:-9222}

"$CHROME_APP" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE_DIR" \
  --profile-directory="Default" \
  --no-first-run \
  --no-default-browser-check \
  --disable-features=AutomationControlled \
  "https://www.zhipin.com/web/user/?ka=header-login" &

echo "Chrome launched with remote debugging on port $PORT"
