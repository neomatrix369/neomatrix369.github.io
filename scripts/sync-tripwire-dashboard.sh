#!/usr/bin/env bash
# Thin wrapper: prefer global skill script, else inline sync.
set -euo pipefail

PAGES_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PAGES_ROOT

AGENTS_SYNC="${HOME}/.agents/skills/sync-tripwire-pages/scripts/sync.sh"
CLAUDE_SYNC="${HOME}/.claude/skills/sync-tripwire-pages/scripts/sync.sh"

if [[ -x "$AGENTS_SYNC" ]] || [[ -f "$AGENTS_SYNC" ]]; then
  exec bash "$AGENTS_SYNC" "$@"
fi
if [[ -x "$CLAUDE_SYNC" ]] || [[ -f "$CLAUDE_SYNC" ]]; then
  exec bash "$CLAUDE_SYNC" "$@"
fi

echo "WARN: skill script not found; running inline fallback." >&2
echo "Install: ~/.agents/skills/sync-tripwire-pages/" >&2

DEFAULT_TRIPWIRE_FALLBACK="/Users/swami/git-repos/ai-ml-dl-stuff/tools-and-utilities/tripwire"
if [[ -z "${TRIPWIRE_ROOT:-}" ]]; then
  if [[ -d "$PAGES_ROOT/../tripwire/prototypes/dc-dashboard" ]]; then
    TRIPWIRE_ROOT="$(cd "$PAGES_ROOT/../tripwire" && pwd)"
  else
    TRIPWIRE_ROOT="$DEFAULT_TRIPWIRE_FALLBACK"
  fi
fi

SRC="$TRIPWIRE_ROOT/prototypes/dc-dashboard"
DEST="$PAGES_ROOT/demos/tripwire-dashboard"
JS_MODULES=(support.js tripwire-data.js tripwire-live.js tripwire-realtime.js tripwire-status.js)

[[ -f "$SRC/Tripwire.dc.html" ]] || { echo "ERROR: missing $SRC/Tripwire.dc.html" >&2; exit 1; }
mkdir -p "$DEST"
for f in "${JS_MODULES[@]}"; do
  cp "$SRC/$f" "$DEST/$f"
done
cp "$SRC/Tripwire.dc.html" "$DEST/index.html"
if grep -q "tripwire-data-source-mode') || 'live'" "$DEST/index.html"; then
  tmp="$(mktemp)"
  sed "s/tripwire-data-source-mode') || 'live'/tripwire-data-source-mode') || 'mock'/g" \
    "$DEST/index.html" >"$tmp"
  mv "$tmp" "$DEST/index.html"
fi
cat >"$DEST/tripwire-dashboard.config.js" <<'EOF'
// Static GitHub Pages deploy — mock data only (no Supabase proxy).
window.__TRIPWIRE_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
};
EOF
echo "Inline sync complete → $DEST"
