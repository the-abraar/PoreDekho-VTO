#!/usr/bin/env bash
# One command for all checks. `--fast` = lint + stray files only (pre-commit).
set -euo pipefail
cd "$(dirname "$0")/.."
FAST=0; [ "${1:-}" = "--fast" ] && FAST=1
names=(); results=()
run() { # run <name> <cmd...>
  local n=$1; shift
  echo "== $n"
  if "$@"; then results+=(pass); else results+=(fail); fi
  names+=("$n")
}

inline_scripts() { node scripts/check-inline-scripts.mjs ./*.html && node --check sw.js; }

stray() {
  local out; out=$(find . \( -path ./.git -o -path ./node_modules \) -prune -o \
    \( -name '*-e' -o -name '*.orig' -o -name '*.rej' -o -name '*.bak' \) -print)
  [ -z "$out" ] || { echo "$out"; return 1; }
}

claims() {
  local rc=0 ex=(--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=scripts --exclude=AGENTS.md --exclude=CODING_STANDARDS.md --exclude=judge.md --exclude=claims_to_verify.md --exclude=pricing_open_questions.md)
  grep -rniE "Aarong|BRAC|Tanishq|Kalyan|Mejuri|Kendra Scott|Diamond World|Jarwa" "${ex[@]}" . && rc=1
  grep -rniE "Meta Spark|8th Wall" "${ex[@]}" . | grep -viE "discontinued|not available|shut down|wind-down" && rc=1
  return $rc
}

# Camera frames must stay on-device: flag canvas export in tryon.html near network calls.
privacy() {
  local net='fetch\(|XMLHttpRequest|sendBeacon|WebSocket'
  if grep -nE "$net" tryon.html; then
    echo "REVIEW: network call in tryon.html; confirm no canvas/video data is sent"
    grep -qE 'toDataURL|toBlob|getImageData' tryon.html && return 1
  fi
  return 0
}

run "inline-scripts" inline_scripts
run "lint-innerhtml" scripts/lint-innerhtml.sh
run "stray-files" stray
if [ $FAST -eq 0 ]; then
  run "claims-guard" claims
  run "camera-privacy" privacy
fi

echo; printf '%-18s | %s\n' step result; printf '%-18s-+-%s\n' ------------------ ------
rc=0
for i in "${!names[@]}"; do printf '%-18s | %s\n' "${names[$i]}" "${results[$i]}"; [ "${results[$i]}" = fail ] && rc=1; done
exit $rc
