#!/bin/bash
set -euo pipefail

# Debug logging — check /tmp/aiwf-hook-lint.log to verify hooks fire
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] post-edit-lint fired" >> /tmp/aiwf-hook-lint.log 2>/dev/null || true

# Read tool input from env var or stdin
INPUT="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$INPUT" ]; then
  INPUT=$(cat 2>/dev/null) || true
fi

if [ -z "$INPUT" ]; then
  exit 0
fi

# Extract the file path from Claude's tool input
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Read project config for linter command
CONFIG_FILE=".workflow-config"
if [ ! -f "$CONFIG_FILE" ]; then
  exit 0
fi

LINTER=$(jq -r '.linter_command // empty' "$CONFIG_FILE")
FORMATTER=$(jq -r '.formatter_command // empty' "$CONFIG_FILE")

# Run formatter first (if configured)
if [ -n "$FORMATTER" ]; then
  bash -c "$FORMATTER $FILE_PATH" 2>/dev/null || true
fi

# Run linter (if configured)
if [ -n "$LINTER" ]; then
  LINT_OUTPUT=$(bash -c "$LINTER $FILE_PATH" 2>&1) || {
    echo "Lint errors in $FILE_PATH:" >&2
    echo "$LINT_OUTPUT" >&2
    exit 0
  }
fi

exit 0
