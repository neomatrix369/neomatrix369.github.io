#!/usr/bin/env bash
set -euo pipefail

PAGES_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEFAULT_DOCEXTRACT_ROOT="/Users/swami/git-repos/ai-ml-dl-stuff/playgroups/playgroup_202602_docextract"
DOCEXTRACT_ROOT="${DOCEXTRACT_ROOT:-$DEFAULT_DOCEXTRACT_ROOT}"
SYNC="$DOCEXTRACT_ROOT/.devin/skills/sync-docextract-pages/scripts/sync.sh"
export PAGES_ROOT DOCEXTRACT_ROOT

if [[ ! -f "$SYNC" ]]; then
  echo "ERROR: DocExtract sync skill not found: $SYNC" >&2
  exit 1
fi

exec bash "$SYNC" "$@"
