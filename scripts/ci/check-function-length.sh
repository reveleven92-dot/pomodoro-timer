#!/usr/bin/env bash
# Check that no function exceeds 80 lines (Python, JS, TS).
# Usage: ./scripts/ci/check-function-length.sh [directory]
set -euo pipefail

MAX_LINES=80
TARGET="${1:-.}"
fail=0

# Python: count lines between "def " and next "def " or dedent
check_python() {
  local file="$1"
  python3 -c "
import ast, sys

with open('$file', 'r') as f:
    try:
        tree = ast.parse(f.read())
    except SyntaxError:
        sys.exit(0)

for node in ast.walk(tree):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        length = node.end_lineno - node.lineno + 1
        if length > $MAX_LINES:
            print(f'FAIL: $file:{node.lineno} function {node.name} has {length} lines (max $MAX_LINES)', file=sys.stderr)
            sys.exit(1)
" 2>&1 || fail=1
}

# JS/TS: simple heuristic — count lines between function/method declarations
check_js_ts() {
  local file="$1"
  python3 -c "
import re, sys

with open('$file', 'r') as f:
    lines = f.readlines()

func_pattern = re.compile(r'^\s*(export\s+)?(async\s+)?function\s+\w+|^\s*(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?\(|^\s*(async\s+)?\w+\s*\([^)]*\)\s*\{')
in_func = False
func_name = ''
func_start = 0
brace_depth = 0

for i, line in enumerate(lines, 1):
    if not in_func and func_pattern.match(line):
        in_func = True
        func_name = line.strip()[:60]
        func_start = i
        brace_depth = line.count('{') - line.count('}')
        continue
    if in_func:
        brace_depth += line.count('{') - line.count('}')
        if brace_depth <= 0:
            length = i - func_start + 1
            if length > $MAX_LINES:
                print(f'FAIL: $file:{func_start} function has {length} lines (max $MAX_LINES)', file=sys.stderr)
                sys.exit(1)
            in_func = False
" 2>&1 || fail=1
}

# Check Python files
while IFS= read -r -d '' file; do
  check_python "$file"
done < <(find "$TARGET" -type f -name '*.py' \
  ! -path '*/node_modules/*' ! -path '*/.venv/*' ! -path '*/__pycache__/*' ! -path '*/.worktrees/*' \
  -print0)

# Check JS/TS files
while IFS= read -r -d '' file; do
  check_js_ts "$file"
done < <(find "$TARGET" -type f \( -name '*.js' -o -name '*.ts' -o -name '*.tsx' -o -name '*.jsx' \) \
  ! -path '*/node_modules/*' ! -path '*/.venv/*' ! -path '*/.worktrees/*' \
  -print0)

if [[ "$fail" -eq 0 ]]; then
  echo "OK: all functions are within $MAX_LINES lines."
  exit 0
fi

exit 1
