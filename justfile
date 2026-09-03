# Static website build and Cloudflare Pages deployment.

default:
    @just --list

# Remove generated output.
clean:
    @npm run clean

# Build a local, readable site.
build:
    @npm run build

# Build the clean production artifact.
build-production:
    @npm run dist

# Check public pages and the RSS feed.
verify-public-build:
    #!/usr/bin/env bash
    set -euo pipefail
    for page in dist/index.html dist/blog/index.html dist/microblog/index.html dist/rss.xml; do
        if [ ! -s "$page" ]; then
            echo "FAIL: missing generated page: $page"
            exit 1
        fi
    done
    MAP_FILE=$(find dist -name '*.map' -print -quit)
    if [ -n "$MAP_FILE" ]; then
        echo "FAIL: production output contains source map: $MAP_FILE"
        exit 1
    fi
    echo "Public build check passed"

# Serve the production artifact through Wrangler.
serve-dist port="8788":
    @npx wrangler pages dev dist --port {{port}}

# Upload a built artifact to Cloudflare Pages.
deploy-production project="bitsofparag": verify-public-build
    @npx wrangler pages deploy dist --project-name {{project}} --branch main

# Check the deployed content streams.
smoke-http url:
    #!/usr/bin/env bash
    set -euo pipefail
    BASE="{{url}}"
    BASE="${BASE%/}"
    for path in / /blog/ /microblog/ /rss.xml; do
        STATUS=$(curl --silent --show-error --location --max-time 20 --output /dev/null --write-out '%{http_code}' "$BASE$path")
        if [ "$STATUS" != "200" ]; then
            echo "FAIL: $BASE$path returned $STATUS"
            exit 1
        fi
    done
    echo "Smoke passed: home, writings, microblog, and RSS returned 200"
