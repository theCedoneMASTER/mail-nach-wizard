#!/bin/bash
# Auto-commit und push bei Dateiänderungen

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

echo "👀 Watching for changes in $REPO_DIR ..."
echo "   Drücke Ctrl+C zum Beenden."
echo ""

fswatch -o --exclude="\.git" . | while read -r; do
  sleep 1  # kurz warten, falls mehrere Dateien gleichzeitig gespeichert werden

  if git diff --quiet && git diff --cached --quiet; then
    continue  # keine Änderungen
  fi

  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  git add index.html styles.css script.js 2>/dev/null
  git commit -m "Auto-update: $TIMESTAMP" 2>/dev/null && \
  git push origin master && \
  echo "✅ [$TIMESTAMP] Änderungen gepusht." || \
  echo "⚠️  [$TIMESTAMP] Push fehlgeschlagen."
done
