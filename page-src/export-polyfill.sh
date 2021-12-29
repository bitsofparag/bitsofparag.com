#!/bin/bash
# Run this as:
# ls *.org | xargs -I{} ./export-polyfill.sh {}
set -euo pipefail

echo $1

sed -i "s/begin_export html/begin_html/gi" $1
sed -i "s/end_export/end_html/gi" $1
