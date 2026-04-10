#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Installing npm dependencies..."
npm install

echo "Ensuring output directory exists..."
mkdir -p out

echo "Session setup complete."
