#!/usr/bin/env bash
# PostToolUse lint gate for Next.js / React projects.
# Reads the edited file path from the hook payload on stdin and lints THAT file
# only. Exit 2 (blocking) on real lint errors; a broken toolchain is reported as
# a warning, never as a block. Non-source files are skipped silently.

set -uo pipefail

MAX_LINES=60

PAYLOAD="$(cat)"
FILE_PATH="$(printf '%s' "$PAYLOAD" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"

[ -z "$FILE_PATH" ] && exit 0
[ -f "$FILE_PATH" ] || exit 0

# Walk up to the nearest package.json
DIR="$(cd "$(dirname "$FILE_PATH")" && pwd)"
ROOT=""
while [ "$DIR" != "/" ]; do
  if [ -f "$DIR/package.json" ]; then ROOT="$DIR"; break; fi
  DIR="$(dirname "$DIR")"
done
[ -z "$ROOT" ] && exit 0

cd "$ROOT" || exit 0
REL="${FILE_PATH#"$ROOT"/}"

case "$REL" in
  node_modules/*|.next/*|dist/*|build/*|coverage/*|*.d.ts) exit 0 ;;
esac

OUT=""
BLOCK=0
WARN=""

trim() { printf '%s\n' "$1" | tail -n "$MAX_LINES"; }

case "$REL" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs)
    if [ -x node_modules/.bin/eslint ]; then
      ESLINT_OUT="$(./node_modules/.bin/eslint --fix "$REL" 2>&1)"; CODE=$?
      case "$CODE" in
        0) ;;
        1) BLOCK=1; OUT="$(trim "$ESLINT_OUT")" ;;
        *) WARN="ESLint could not run (exit $CODE) — toolchain problem, not your code. Run yarn install." ;;
      esac
    fi
    if grep -n 'console\.log' "$REL" >/dev/null 2>&1; then
      WARN="${WARN}${WARN:+ }console.log in $REL — remove before committing."
    fi
    ;;
  *.scss|*.css)
    if [ -x node_modules/.bin/stylelint ]; then
      STYLE_OUT="$(./node_modules/.bin/stylelint --fix "$REL" 2>&1)"; CODE=$?
      case "$CODE" in
        0) ;;
        2) BLOCK=1; OUT="$(trim "$STYLE_OUT")" ;;
        *) WARN="Stylelint could not run (exit $CODE) — toolchain problem, not your code." ;;
      esac
    fi
    ;;
  *) exit 0 ;;
esac

if [ "$BLOCK" -eq 1 ]; then
  printf 'Lint errors in %s — fix them before continuing:\n%s\n' "$REL" "$OUT" >&2
  exit 2
fi

[ -n "$WARN" ] && printf 'WARNING: %s\n' "$WARN"
exit 0
