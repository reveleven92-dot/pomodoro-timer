#!/usr/bin/env bash
# Run the project's configured linter.
# Usage: ./scripts/ci/check-lint.sh [directory]
#
# Supports: Python (ruff), JS/TS (eslint)
set -euo pipefail

TARGET="${1:-.}"

if [[ -f "$TARGET/pyproject.toml" ]] || [[ -f "$TARGET/ruff.toml" ]] || [[ -f "$TARGET/.ruff.toml" ]]; then
  echo "Detected Python project. Running ruff..."
  cd "$TARGET"
  ruff check .
  echo "OK: ruff passed."

elif [[ -f "$TARGET/.eslintrc.js" ]] || [[ -f "$TARGET/.eslintrc.json" ]] || [[ -f "$TARGET/.eslintrc.yml" ]] || [[ -f "$TARGET/eslint.config.js" ]] || [[ -f "$TARGET/eslint.config.mjs" ]]; then
  echo "Detected JS/TS project. Running eslint..."
  cd "$TARGET"
  npx eslint .
  echo "OK: eslint passed."

elif [[ -f "$TARGET/package.json" ]] && grep -q '"eslint"' "$TARGET/package.json" 2>/dev/null; then
  echo "Detected JS/TS project (eslint in package.json). Running eslint..."
  cd "$TARGET"
  npx eslint .
  echo "OK: eslint passed."

else
  echo "No recognized linter configuration found in $TARGET."
  echo "Supported: ruff (Python), eslint (JS/TS)"
  exit 1
fi
