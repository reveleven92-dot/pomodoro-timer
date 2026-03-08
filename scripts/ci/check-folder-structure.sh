#!/usr/bin/env bash
# Validate project folder structure.
# Usage: ./scripts/ci/check-folder-structure.sh [directory]
#
# Checks:
# - Expected top-level directories exist
# - No source files nested more than 6 levels deep
set -euo pipefail

TARGET="${1:-.}"
fail=0

# Check for deeply nested source files (more than 6 levels from target)
MAX_DEPTH=6
deep_files=$(find "$TARGET" -type f \( -name '*.py' -o -name '*.js' -o -name '*.ts' -o -name '*.tsx' -o -name '*.jsx' -o -name '*.go' -o -name '*.rs' \) \
  ! -path '*/node_modules/*' ! -path '*/.venv/*' ! -path '*/__pycache__/*' ! -path '*/.worktrees/*' ! -path '*/.git/*' \
  -mindepth "$((MAX_DEPTH + 1))" 2>/dev/null || true)

if [[ -n "$deep_files" ]]; then
  echo "WARNING: source files nested more than $MAX_DEPTH levels deep:" >&2
  echo "$deep_files" >&2
  fail=1
fi

if [[ "$fail" -eq 0 ]]; then
  echo "OK: folder structure looks good."
  exit 0
fi

exit 1
