#!/usr/bin/env bash
# Check that test coverage meets the minimum threshold (default 80%).
# Usage: ./scripts/ci/check-test-coverage.sh [directory]
#
# Supports: Python (pytest-cov), JS/TS (jest/vitest/nyc)
# Set MIN_COVERAGE env var to override the default.
set -euo pipefail

MIN_COVERAGE="${MIN_COVERAGE:-80}"
TARGET="${1:-.}"

# Detect project type and run coverage
if [[ -f "$TARGET/pytest.ini" ]] || [[ -f "$TARGET/pyproject.toml" ]] || [[ -f "$TARGET/setup.py" ]]; then
  echo "Detected Python project. Running pytest with coverage..."
  cd "$TARGET"
  if [[ -d ".venv" ]]; then
    ./.venv/bin/pytest --cov=. --cov-report=term --cov-fail-under="$MIN_COVERAGE" -q
  else
    pytest --cov=. --cov-report=term --cov-fail-under="$MIN_COVERAGE" -q
  fi

elif [[ -f "$TARGET/package.json" ]]; then
  echo "Detected JS/TS project. Running coverage..."
  cd "$TARGET"
  if grep -q '"vitest"' package.json 2>/dev/null; then
    npx vitest run --coverage --coverage.thresholds.lines="$MIN_COVERAGE" 2>/dev/null || \
    npx vitest run --coverage
  elif grep -q '"jest"' package.json 2>/dev/null; then
    npx jest --coverage --coverageThreshold="{\"global\":{\"lines\":$MIN_COVERAGE}}"
  else
    echo "No recognized test runner found in package.json."
    echo "Supported: jest, vitest"
    exit 1
  fi

else
  echo "No recognized project type found in $TARGET."
  echo "Supported: Python (pytest), JS/TS (jest, vitest)"
  exit 1
fi

echo "OK: test coverage meets minimum threshold of ${MIN_COVERAGE}%."
