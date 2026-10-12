#!/usr/bin/env bash
# Fail on interpolation/concatenation into innerHTML & co. Allow with trailing `// safe-html: <reason>`.
set -uo pipefail
cd "$(dirname "$0")/.."
files=$(find . \( -path ./.git -o -path ./node_modules -o -path ./dist -o -path ./build \) -prune -o \
  \( -name '*.html' -o -name '*.js' -o -name '*.jsx' -o -name '*.tsx' -o -name '*.mjs' \) -print | grep -v '\.min\.')
[ -z "$files" ] && exit 0
sink='(innerHTML|outerHTML)[[:space:]]*\+?=|insertAdjacentHTML[[:space:]]*\(|document\.write(ln)?[[:space:]]*\(|dangerouslySetInnerHTML'
# hit = sink plus a ${...} interpolation or a + concatenation on the same line
hits=$(echo "$files" | xargs grep -nE "($sink).*(\\$\\{|[\"'\`][[:space:]]*\\+|\\+[[:space:]]*[\"'\`A-Za-z_(])" 2>/dev/null \
  | grep -v 'safe-html:' || true)
if [ -n "$hits" ]; then echo "$hits"; echo "lint-innerhtml: unsafe HTML sinks above (add '// safe-html: <reason>' if justified)"; exit 1; fi
echo "lint-innerhtml: ok"
