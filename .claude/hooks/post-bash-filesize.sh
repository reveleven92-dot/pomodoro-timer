#!/bin/bash
set -euo pipefail

# Debug logging — check /tmp/aiwf-hook-bash-filesize.log to verify hooks fire
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] post-bash-filesize fired" >> /tmp/aiwf-hook-bash-filesize.log 2>/dev/null || true

# Read tool input from env var or stdin
INPUT="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$INPUT" ]; then
  INPUT=$(cat 2>/dev/null) || true
fi

if [ -z "$INPUT" ]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.command // empty' 2>/dev/null) || true

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Detect file-writing patterns and extract the target file path
FILE_PATH=""

# Pattern: redirect operators (>, >>)
# Matches: command > file, command >> file, cat > file, echo "..." > file
if echo "$COMMAND" | grep -qE '>\s*\S+'; then
  # Extract the last file path after > or >> (skip lines with 2>&1, >&2, /dev/null)
  FILE_PATH=$(echo "$COMMAND" | grep -oE '>>?[[:space:]]*[^ ;&|]+' | tail -1 | sed 's/>>*[[:space:]]*//' | tr -d "'\"")
  # Skip non-file redirects
  if echo "$FILE_PATH" | grep -qE '^(/dev/|&|[0-9])'; then
    FILE_PATH=""
  fi
fi

# Pattern: tee <file>
if [ -z "$FILE_PATH" ] && echo "$COMMAND" | grep -qE '\btee[[:space:]]+'; then
  FILE_PATH=$(echo "$COMMAND" | grep -oE '\btee[[:space:]]+(-a[[:space:]]+)?[^ ;&|]+' | head -1 | sed 's/tee[[:space:]]*\(-a[[:space:]]*\)*//')
fi

# Pattern: cp <src> <dest>
if [ -z "$FILE_PATH" ] && echo "$COMMAND" | grep -qE '\bcp\s+'; then
  FILE_PATH=$(echo "$COMMAND" | grep -oE '\bcp\s+[^ ]+\s+[^ ;&|]+' | head -1 | awk '{print $NF}')
fi

# Pattern: mv <src> <dest>
if [ -z "$FILE_PATH" ] && echo "$COMMAND" | grep -qE '\bmv\s+'; then
  FILE_PATH=$(echo "$COMMAND" | grep -oE '\bmv\s+[^ ]+\s+[^ ;&|]+' | head -1 | awk '{print $NF}')
fi

# Pattern: python3 -c "...open(..." or python3 <script> writing to file
if [ -z "$FILE_PATH" ] && echo "$COMMAND" | grep -qE 'python3?\s+-c.*open\('; then
  FILE_PATH=$(echo "$COMMAND" | grep -oE "open\(['\"]([^'\"]+)['\"]" | head -1 | sed "s/open(['\"]//;s/['\"]//")
fi

# Trim whitespace from FILE_PATH
FILE_PATH=$(echo "$FILE_PATH" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

# If no file path detected, nothing to check
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Resolve relative paths
if [[ "$FILE_PATH" != /* ]]; then
  FILE_PATH="$(pwd)/$FILE_PATH"
fi

# Check if the file exists and exceeds 800 lines
if [ -f "$FILE_PATH" ]; then
  LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')
  if [ "$LINE_COUNT" -gt 800 ]; then
    echo "WARNING: $FILE_PATH is $LINE_COUNT lines (max 800). Split this file before continuing." >&2
  fi
fi

exit 0
