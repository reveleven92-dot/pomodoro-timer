#!/bin/bash
set -euo pipefail

# Debug logging — check /tmp/aiwf-hook-prebash.log to verify hooks fire
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] pre-bash-safety fired" >> /tmp/aiwf-hook-prebash.log 2>/dev/null || true

INPUT="${CLAUDE_TOOL_INPUT:-}"
if [ -z "$INPUT" ]; then
  INPUT=$(cat 2>/dev/null) || true
fi
COMMAND=$(echo "$INPUT" | jq -r '.command // empty' 2>/dev/null) || true

if [ -z "$COMMAND" ]; then
  echo '{"decision": "approve"}'
  exit 0
fi

# Block dangerous git operations
if echo "$COMMAND" | grep -qE 'git\s+(push\s+--force|push\s+-f|reset\s+--hard|clean\s+-fd)'; then
  cat <<EOF
{
  "decision": "block",
  "reason": "Blocked: dangerous git operation detected. Use safe alternatives:\n- Instead of force push: git push --force-with-lease\n- Instead of reset --hard: git stash or git revert\n- Instead of clean -fd: manually remove specific files"
}
EOF
  exit 0
fi

# Block rm -rf on broad paths
if echo "$COMMAND" | grep -qE 'rm\s+-rf?\s+(/|~|\.\.)'; then
  cat <<EOF
{
  "decision": "block",
  "reason": "Blocked: recursive deletion on broad path. Be specific about what you're deleting."
}
EOF
  exit 0
fi

# Block direct commits to main
if echo "$COMMAND" | grep -qE 'git\s+(commit|push.*\smain|push.*origin\s+main)' && ! echo "$COMMAND" | grep -qE 'worktree|checkout|branch'; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    cat <<EOF
{
  "decision": "block",
  "reason": "Blocked: direct commit/push to $CURRENT_BRANCH. Use a feature branch or worktree."
}
EOF
    exit 0
  fi
fi

echo '{"decision": "approve"}'
exit 0
