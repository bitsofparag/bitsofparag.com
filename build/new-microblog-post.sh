#!/bin/bash

# This script creates a new .org file in the "microblog" directory under the current month and year as the subfolders.
# The filename is provided by user as argument to the script. The content of the file is rendered from "microblog/post.tpl" template.

filename=$1
month=$(date +%m)
year=$(date +%Y)
title=$(echo "$filename" | sed -E 's/[-]/ /g' | awk '{ for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2)); }1')
filerootpath=page-src/microblog/"$year"/"$month"
echo "$title"
# Get date in the format "2023-07-13 Thu"
orgmode_date=$(date +"%Y-%m-%d %a")
# Get date in the format "18 Jul 2023"
pub_date=$(date +"%d %b %Y")

mkdir -p "$filerootpath"

cat page-src/microblog/post.tpl \
    | sed "s|\${DATE}|${orgmode_date}|" \
    | sed "s|\${TITLE}|${title}|" \
    | sed "s|\${CUSTOM_ID}|${filename}|" \
    | sed "s|\${PUB_DATE}|${pub_date}|" \
    > "$filerootpath"/"$filename".org

first_include_line=$(grep -n "#+include:" page-src/microblog/index.org | head -1 | cut -d ':' -f 1)
if [ -z "$first_include_line" ]; then
    echo "No existing #+include entries found in microblog index.org file"
  exit 1
fi
sed -i "${first_include_line}i#+include: \"./${year}/${month}/${filename}.org\"" page-src/microblog/index.org
