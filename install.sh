#!/usr/bin/env bash
set -euo pipefail

# When piped (curl | bash), read from terminal directly
if [ -t 0 ]; then
    READ_FROM=""
else
    READ_FROM="/dev/tty"
fi
ask() { if [ -n "$READ_FROM" ]; then read "$@" < "$READ_FROM"; else read "$@"; fi; }

REPO_URL="https://github.com/workspace-studio/frontend-agent"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

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
    ask -p "Continue anyway? (y/N) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]] || exit 1
fi

echo "Detected stack: $STACK"

# --- Create directory structure ---
mkdir -p .claude/{agents,knowledge,examples,rules}
for skill in create-component create-view add-store setup-i18n setup-theme add-form add-shared-components seo-audit bootstrap-nextjs bootstrap-react write-tests test-page test-flow fix-issue create-pr refactor deploy figma-to-component sync-tokens figma-review; do
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

# --- Optional: Figma MCP ---
FIGMA_MCP="no"
ask -p "Configure Figma MCP integration? (y/N) " -n 1 -r FIGMA_REPLY
echo
if [[ $FIGMA_REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Select Figma MCP server:"
    echo "  1) Official Remote (mcp.figma.com) — 13 tools, read-only, browser auth"
    echo "  2) Official Desktop (127.0.0.1:3845) — 13 tools, read-only, requires Figma Desktop"
    echo "  3) Figma Console MCP (southleft) — 59+ tools, read+write, open source"
    echo "     Best for: design system engineering, bidirectional workflows"
    echo ""
    echo "  TIP: Options 1+3 or 2+3 work together (official for Code Connect, console for token management)"
    ask -p "Choice [1/2/3]: " -n 1 -r FIGMA_CHOICE
    echo
    echo ""
    ask -p "Apply to all projects (--scope user)? (y/N) " -n 1 -r SCOPE_REPLY
    echo

    SCOPE_FLAG=""
    if [[ $SCOPE_REPLY =~ ^[Yy]$ ]]; then
        SCOPE_FLAG="--scope user"
    fi

    case $FIGMA_CHOICE in
        1) FIGMA_URL="https://mcp.figma.com/mcp"; FIGMA_MCP="remote" ;;
        2) FIGMA_URL="http://127.0.0.1:3845/mcp"; FIGMA_MCP="desktop" ;;
        3) FIGMA_MCP="console" ;;
        *) echo "Invalid choice, skipping Figma MCP." ;;
    esac

    if [ "$FIGMA_MCP" != "no" ]; then
        if command -v claude &> /dev/null; then
            if [ "$FIGMA_MCP" = "console" ]; then
                # Figma Console MCP (southleft) — 59+ tools, read+write
                # Requires: Figma Desktop app with Console MCP plugin
                # Source: https://github.com/southleft/figma-console-mcp
                claude mcp add $SCOPE_FLAG figma -- npx -y figma-console-mcp 2>/dev/null || true
            else
                # Official Figma MCP (remote or desktop) — 13 tools, read-only
                claude mcp add $SCOPE_FLAG --transport http figma "$FIGMA_URL" 2>/dev/null || true
            fi
            echo "Figma MCP configured ($FIGMA_MCP)$([ -n "$SCOPE_FLAG" ] && echo ' [all projects]' || echo ' [this project only]')"
        else
            echo "WARNING: 'claude' CLI not found. Install Claude Code first, then run:"
            if [ "$FIGMA_MCP" = "console" ]; then
                echo "  claude mcp add $SCOPE_FLAG figma -- npx -y figma-console-mcp"
            else
                echo "  claude mcp add $SCOPE_FLAG --transport http figma $FIGMA_URL"
            fi
        fi
    fi
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
echo "  Figma MCP: $FIGMA_MCP"
echo "  CLAUDE.md: $([ -f CLAUDE.md ] && echo "present ($STACK)" || echo 'skipped')"
echo ""
if [ "$STACK" = "nextjs" ]; then
    echo "  Skills: /create-component /create-view /setup-i18n /setup-theme /add-form /seo-audit /write-tests /bootstrap-nextjs /fix-issue /create-pr /refactor /deploy /figma-to-component /sync-tokens /figma-review"
else
    echo "  Skills: /create-component /create-view /add-store /setup-i18n /setup-theme /add-form /write-tests /bootstrap-react /fix-issue /create-pr /refactor /deploy /figma-to-component /sync-tokens /figma-review"
fi
echo ""
echo "  Usage: cd $(pwd) && claude"
