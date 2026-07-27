#!/usr/bin/env bash
# PreToolUse guard for Bash calls.
# The repo's own husky/lefthook hooks are the real quality gate, so this only
# stops the ways around them. Fast by design: no build, no typecheck here.

set -uo pipefail

PAYLOAD="$(cat)"
CMD="$(printf '%s' "$PAYLOAD" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)"[[:space:]]*}*.*/\1/p' | head -n1)"

[ -z "$CMD" ] && exit 0

case "$CMD" in
  *--no-verify*)
    echo "BLOCKED: --no-verify skips the project's git hooks. Fix what the hook reports instead." >&2
    exit 2 ;;
esac

case "$CMD" in
  *"push"*"--force"*|*"push"*" -f "*)
    case "$CMD" in
      *"--force-with-lease"*) ;;
      *) echo "BLOCKED: use --force-with-lease instead of a bare force push." >&2; exit 2 ;;
    esac ;;
esac

exit 0
