#!/usr/bin/env bash
# Thin wrapper: prefer AgentVetter project skill script, else inline sync.
set -euo pipefail

PAGES_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PAGES_ROOT

PROJECT_SYNC=""
for candidate in \
  "$PAGES_ROOT/../AgentVetter/.claude/skills/sync-agentvetter-pages/scripts/sync.sh" \
  "$PAGES_ROOT/../agentvetter/.claude/skills/sync-agentvetter-pages/scripts/sync.sh"
do
  if [[ -f "$candidate" ]]; then
    PROJECT_SYNC="$candidate"
    break
  fi
done
CLAUDE_SYNC="${HOME}/.claude/skills/sync-agentvetter-pages/scripts/sync.sh"

if [[ -n "$PROJECT_SYNC" ]]; then
  exec bash "$PROJECT_SYNC" "$@"
fi
if [[ -f "$CLAUDE_SYNC" ]]; then
  exec bash "$CLAUDE_SYNC" "$@"
fi

echo "WARN: skill script not found; running inline fallback." >&2
echo "Install: AgentVetter/.claude/skills/sync-agentvetter-pages/" >&2

DEFAULT_AGENTVETTER_FALLBACK="/Users/swami/git-repos/ai-ml-dl-stuff/tools-and-utilities/AgentVetter"
if [[ -z "${AGENTVETTER_ROOT:-}" ]]; then
  if [[ -d "$PAGES_ROOT/../AgentVetter/prototypes/dc-dashboard" ]]; then
    AGENTVETTER_ROOT="$(cd "$PAGES_ROOT/../AgentVetter" && pwd)"
  elif [[ -d "$PAGES_ROOT/../agentvetter/prototypes/dc-dashboard" ]]; then
    AGENTVETTER_ROOT="$(cd "$PAGES_ROOT/../agentvetter" && pwd)"
  else
    AGENTVETTER_ROOT="$DEFAULT_AGENTVETTER_FALLBACK"
  fi
fi

SRC="$AGENTVETTER_ROOT/prototypes/dc-dashboard"
DEST="$PAGES_ROOT/demos/agentvetter-dashboard"
JS_MODULES=(support.js agentvetter-data.js agentvetter-live.js agentvetter-realtime.js agentvetter-status.js)

[[ -f "$SRC/AgentVetter.dc.html" ]] || { echo "ERROR: missing $SRC/AgentVetter.dc.html" >&2; exit 1; }
mkdir -p "$DEST"
for f in "${JS_MODULES[@]}"; do
  cp "$SRC/$f" "$DEST/$f"
done
cp "$SRC/AgentVetter.dc.html" "$DEST/index.html"
if grep -q "agentvetter-data-source-mode') || 'live'" "$DEST/index.html"; then
  tmp="$(mktemp)"
  sed "s/agentvetter-data-source-mode') || 'live'/agentvetter-data-source-mode') || 'mock'/g" \
    "$DEST/index.html" >"$tmp"
  mv "$tmp" "$DEST/index.html"
fi
cat >"$DEST/agentvetter-dashboard.config.js" <<'EOF'
// Static GitHub Pages deploy — mock data only (no Supabase proxy).
window.__AGENTVETTER_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
};
EOF
echo "Inline sync complete → $DEST"
