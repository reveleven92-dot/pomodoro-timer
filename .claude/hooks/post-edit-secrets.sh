#!/bin/bash
set -euo pipefail

# Post-edit secret scanning — warns if edited file contains potential secrets.
# Does NOT block (exit 0 always). Warns via stderr.
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] post-edit-secrets fired" >> /tmp/aiwf-hook-secrets.log 2>/dev/null || true

INPUT="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$INPUT" ]; then
  INPUT=$(cat 2>/dev/null) || true
fi
[ -z "$INPUT" ] && exit 0

FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty' 2>/dev/null) || exit 0
[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

# Skip binary files and common safe extensions
case "$FILE_PATH" in
  *.png|*.jpg|*.gif|*.ico|*.woff|*.ttf|*.lock|*.min.js|*.min.css) exit 0 ;;
esac

WARNINGS=""

# AWS access keys
if grep -qE 'AKIA[0-9A-Z]{16}' "$FILE_PATH" 2>/dev/null; then
  WARNINGS="${WARNINGS}\n  - AWS access key pattern (AKIA...)"
fi

# Generic secrets: key=value with long values
if grep -qEi '(api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token|private[_-]?key|password)\s*[:=]\s*["\x27][A-Za-z0-9/+=_-]{16,}' "$FILE_PATH" 2>/dev/null; then
  WARNINGS="${WARNINGS}\n  - Potential hardcoded secret (api_key/token/password pattern)"
fi

# Private keys
if grep -ql 'BEGIN.*PRIVATE KEY' "$FILE_PATH" 2>/dev/null; then
  WARNINGS="${WARNINGS}\n  - Private key detected"
fi

# Connection strings with credentials
if grep -qEi '(postgres|mysql|mongodb|redis)://[^:]+:[^@]+@' "$FILE_PATH" 2>/dev/null; then
  WARNINGS="${WARNINGS}\n  - Database connection string with embedded credentials"
fi

# JWT tokens (eyJ...)
if grep -qE 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.' "$FILE_PATH" 2>/dev/null; then
  WARNINGS="${WARNINGS}\n  - JWT token detected"
fi

if [ -n "$WARNINGS" ]; then
  echo "WARNING: Potential secrets detected in $FILE_PATH:" >&2
  echo -e "$WARNINGS" >&2
  echo "  Review before committing. Consider using environment variables instead." >&2
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] SECRETS WARNING in $FILE_PATH:$WARNINGS" >> /tmp/aiwf-hook-secrets.log 2>/dev/null || true
fi

exit 0
