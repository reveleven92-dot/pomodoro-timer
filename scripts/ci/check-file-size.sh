#!/usr/bin/env bash
# Check that no source file exceeds 800 lines.
# Usage: ./scripts/ci/check-file-size.sh [directory]
set -euo pipefail

MAX_LINES=800
TARGET="${1:-.}"
fail=0

while IFS= read -r -d '' file; do
  lines=$(wc -l < "$file")
  if [[ "$lines" -gt "$MAX_LINES" ]]; then
    echo "FAIL: $file has $lines lines (max $MAX_LINES)" >&2
    fail=1
  fi
done < <(find "$TARGET" -type f \( -name '*.py' -o -name '*.js' -o -name '*.ts' -o -name '*.tsx' -o -name '*.jsx' -o -name '*.go' -o -name '*.rs' -o -name '*.rb' -o -name '*.java' -o -name '*.sh' -o -name '*.zsh' \) \
  ! -path '*/node_modules/*' ! -path '*/.venv/*' ! -path '*/__pycache__/*' ! -path '*/.worktrees/*' \
  -print0)

if [[ "$fail" -eq 0 ]]; then
  echo "OK: all files are within $MAX_LINES lines."
  exit 0
fi

exit 1
