#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/workspace-studio/frontend-agent"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Source resolution ---
if [ -f "$SCRIPT_DIR/agents/nextjs.md" ]; then
    SOURCE_DIR="$SCRIPT_DIR"
else
    TEMP_DIR=$(mktemp -d)
    trap 'rm -rf "$TEMP_DIR"' EXIT
    echo "Downloading Frontend Agent..."
    git clone --depth 1 "$REPO_URL" "$TEMP_DIR" 2>/dev/null
    SOURCE_DIR="$TEMP_DIR"
fi

# --- Detect stack ---
STACK="unknown"
if ls next.config.* 1>/dev/null 2>&1; then
    STACK="nextjs"
elif [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
    STACK="react"
fi

# --- Validate target ---
if [ ! -f "package.json" ]; then
    echo "WARNING: No package.json found in $(pwd)"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]] || exit 1
fi

echo "Detected stack: $STACK"

# --- Create directory structure ---
mkdir -p .claude/{agents,knowledge,examples,rules}
for skill in create-component create-view add-store setup-i18n setup-theme add-form seo-audit bootstrap-nextjs bootstrap-react write-tests fix-issue create-pr refactor deploy; do
    mkdir -p ".claude/skills/$skill"
done

# --- Copy agents ---
cp "$SOURCE_DIR/agents/"*.md .claude/agents/

# --- Copy skills ---
for skill_dir in "$SOURCE_DIR/skills/"*/; do
    skill_name=$(basename "$skill_dir")
    cp "$skill_dir"SKILL.md ".claude/skills/$skill_name/SKILL.md" 2>/dev/null || true
done

# --- Copy knowledge + examples + rules ---
cp "$SOURCE_DIR/knowledge/"*.md .claude/knowledge/
cp -r "$SOURCE_DIR/examples/"* .claude/examples/ 2>/dev/null || true
cp "$SOURCE_DIR/rules/"*.md .claude/rules/ 2>/dev/null || true

# --- Install settings.json with hooks (only if not exists) ---
if [ ! -f ".claude/settings.json" ]; then
    cat > .claude/settings.json << 'SETTINGS_EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": { "tool": "Edit" },
        "hooks": [{
          "type": "command",
          "command": "npx eslint --fix $FILEPATH 2>/dev/null || true"
        }]
      },
      {
        "matcher": { "tool": "Edit|Write" },
        "hooks": [{
          "type": "command",
          "command": "npx tsc --noEmit --pretty false 2>&1 | head -20 || true"
        }]
      },
      {
        "matcher": { "tool": "Edit|Write" },
        "hooks": [{
          "type": "command",
          "command": "grep -n 'console\\.log' $FILEPATH 2>/dev/null && echo 'WARNING: console.log found — remove before committing' || true"
        }]
      }
    ],
    "PreToolUse": [
      {
        "matcher": { "tool": "Bash", "command": "git commit" },
        "hooks": [{
          "type": "command",
          "command": "yarn build --quiet 2>/dev/null && yarn lint --quiet 2>/dev/null"
        }]
      },
      {
        "matcher": { "tool": "Bash", "command": "--no-verify" },
        "hooks": [{
          "type": "command",
          "command": "echo 'BLOCKED: --no-verify is not allowed. Always run hooks.' && exit 2"
        }]
      }
    ]
  }
}
SETTINGS_EOF
fi

# --- Install CLAUDE.md from template (only if not exists) ---
if [ ! -f "CLAUDE.md" ]; then
    PROJECT_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "My Project")
    if [ "$STACK" = "nextjs" ]; then
        TEMPLATE="CLAUDE.md.nextjs.template"
    else
        TEMPLATE="CLAUDE.md.react.template"
    fi
    sed "s/{PROJECT_NAME}/$PROJECT_NAME/g" "$SOURCE_DIR/templates/$TEMPLATE" > CLAUDE.md
fi

# --- Summary ---
echo ""
echo "=== Frontend Agent Installed ($STACK) ==="
echo "  Agents:    $(ls .claude/agents/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  Skills:    $(find .claude/skills -name 'SKILL.md' 2>/dev/null | wc -l | tr -d ' ') skills"
echo "  Knowledge: $(ls .claude/knowledge/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  Examples:  $(find .claude/examples -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ') directories"
echo "  Rules:     $(ls .claude/rules/*.md 2>/dev/null | wc -l | tr -d ' ') files"
echo "  Hooks:     $([ -f .claude/settings.json ] && echo 'yes' || echo 'no')"
echo "  CLAUDE.md: $([ -f CLAUDE.md ] && echo "present ($STACK)" || echo 'skipped')"
echo ""
if [ "$STACK" = "nextjs" ]; then
    echo "  Skills: /create-component /create-view /setup-i18n /setup-theme /add-form /seo-audit /write-tests /bootstrap-nextjs /fix-issue /create-pr /refactor /deploy"
else
    echo "  Skills: /create-component /create-view /add-store /setup-i18n /setup-theme /add-form /write-tests /bootstrap-react /fix-issue /create-pr /refactor /deploy"
fi
echo ""
echo "  Usage: cd $(pwd) && claude"
