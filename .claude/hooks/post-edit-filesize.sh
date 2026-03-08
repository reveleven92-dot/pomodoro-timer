#!/bin/bash
set -euo pipefail

# Debug logging — check /tmp/aiwf-hook-filesize.log to verify hooks fire
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] post-edit-filesize fired" >> /tmp/aiwf-hook-filesize.log 2>/dev/null || true

INPUT="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$INPUT" ]; then
  INPUT=$(cat 2>/dev/null) || true
fi

if [ -z "$INPUT" ]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')

if [ "$LINE_COUNT" -gt 800 ]; then
  echo "WARNING: $FILE_PATH is $LINE_COUNT lines (max 800). Split this file before continuing." >&2
fi

exit 0
