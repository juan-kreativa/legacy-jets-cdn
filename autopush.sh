#!/bin/bash

ls styles.css script.js | entr -r bash -c '
  echo "🟢 Detected changes, pushing to GitHub..."
  git add styles.css script.js
  git commit -m "Auto update at $(date)"
  git push origin main
  echo "✅ Push complete at $(date)"
'
