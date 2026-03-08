#!/bin/bash

# macOS notification
if command -v osascript &> /dev/null; then
  osascript -e 'display notification "Agent has finished its task" with title "Claude Code" sound name "Glass"'
# Linux notification
elif command -v notify-send &> /dev/null; then
  notify-send "Claude Code" "Agent has finished its task"
fi

exit 0
