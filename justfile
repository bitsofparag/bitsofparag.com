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

# Run image optimizer tests with race detection and coverage.
test-image-optimizer:
    @cd tools/image-optimizer && go test -race -cover ./...

# Format image optimizer source.
format-image-optimizer:
    @cd tools/image-optimizer && gofmt -w *.go

# Convert published JPEG and PNG images to WebP.
optimize-images:
    @cd tools/image-optimizer && go run . ../../dist/static/images

# Keep linked JavaScript and CSS below required max size.
verify-bundle-size max_bytes="28995":
    #!/usr/bin/env bash
    set -euo pipefail
    MAX_BYTES="{{max_bytes}}"
    FILES=(
        dist/static/styles/index.css
        dist/static/scripts/index.js
    )
    TOTAL=0
    for file in "${FILES[@]}"; do
        if [ ! -s "$file" ]; then
            echo "FAIL: missing bundle asset: $file"
            exit 1
        fi
        SIZE=$(wc -c < "$file")
        TOTAL=$((TOTAL + SIZE))
    done
    if [ "$TOTAL" -gt "$MAX_BYTES" ]; then
        echo "FAIL: JS + CSS bundle is $TOTAL bytes; budget is $MAX_BYTES bytes"
        exit 1
    fi
    echo "Bundle size passed: $TOTAL / $MAX_BYTES bytes"

# Check public pages and the RSS feed.
verify-public-build: verify-bundle-size
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
deploy-production project="bitsofparag-com-live": verify-public-build
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
