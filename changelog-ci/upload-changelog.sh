#!/bin/bash
# Upload Changelog to the HearthShelf website
#
# Extracts the current version's changelog section from CHANGELOG.md and POSTs
# it to the website changelog API for display.
#
# Usage: ./upload-changelog.sh [changelog_file]
#   changelog_file: Path to CHANGELOG.md (default: CHANGELOG.md)
#
# Environment variables:
#   CHANGELOG_API_KEY: Bearer token for the changelog endpoint (required)
#   GITHUB_REF: GitHub ref (refs/tags/vX.Y.Z) for version detection
#   PRODUCT_NAME: Override product name (auto-detected from .changelog.yml)
#   DOWNLOAD_URL: Optional download URL stored alongside the entry
#   API_URL: Override the API endpoint (default below)

set -eE
trap 'echo "ERROR at line ${LINENO}: ${BASH_COMMAND}" >&2' ERR

CHANGELOG_FILE="${1:-CHANGELOG.md}"
API_URL="${API_URL:-https://hearthshelf.com/api/v1/changelogs}"

if [ -z "$CHANGELOG_API_KEY" ]; then
    echo "ERROR: CHANGELOG_API_KEY not set" >&2
    exit 1
fi

if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "ERROR: Changelog file not found: $CHANGELOG_FILE" >&2
    exit 1
fi

if [ -z "$GITHUB_REF" ] || [[ ! "$GITHUB_REF" =~ ^refs/tags/ ]]; then
    echo "SKIP: Not a tag push (GITHUB_REF=$GITHUB_REF), skipping upload" >&2
    exit 0
fi

# --- Detect product name + download URL from .changelog.yml ---
if [ -f ".changelog.yml" ]; then
    [ -z "$PRODUCT_NAME" ] && PRODUCT_NAME=$(grep "^product-name:" .changelog.yml | sed 's/^product-name: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | sed 's/^ *//;s/ *$//')
    [ -z "$DOWNLOAD_URL" ] && DOWNLOAD_URL=$(grep "^download-url:" .changelog.yml | sed 's/^download-url: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | sed 's/^ *//;s/ *$//')
fi

if [ -z "$PRODUCT_NAME" ]; then
    PRODUCT_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
fi

echo "Product: $PRODUCT_NAME"

TAG="${GITHUB_REF#refs/tags/}"
VERSION="${TAG#v}"
echo "Version: $VERSION"

# --- Extract the current version section's content (no headings) ---
extract_changelog() {
    local file="$1"
    local version="$2"
    local in_version_section=0
    local found_content=0
    local output=""

    while IFS= read -r line; do
        if [[ "$line" =~ ^##\  ]]; then
            if [[ "$line" =~ "This Release" ]]; then
                in_version_section=0; continue
            fi
            if [[ "$line" =~ "Version ${version}" ]] || [[ "$line" =~ "Version v${version}" ]]; then
                in_version_section=1; found_content=1; continue
            fi
            in_version_section=0; continue
        fi
        if [ $in_version_section -eq 1 ]; then
            output+="$line"$'\n'
        fi
    done < "$file"

    if [ $found_content -eq 0 ]; then
        local in_content=0
        while IFS= read -r line; do
            if [[ "$line" =~ ^"# " ]] && [ $in_content -eq 0 ]; then
                in_content=1; continue
            fi
            if [[ "$line" =~ "Last Month" ]] || [[ "$line" =~ ^"---"$ ]]; then
                break
            fi
            if [[ "$line" =~ ^"## " ]] && ([[ "$line" =~ "This Release" ]] || [[ "$line" =~ ^"## Version " ]]); then
                continue
            fi
            if [ $in_content -eq 1 ]; then
                output+="$line"$'\n'
            fi
        done < "$file"
    fi

    echo "$output"
}

CHANGELOG_CONTENT=$(extract_changelog "$CHANGELOG_FILE" "$VERSION")

if [ -z "$(echo "$CHANGELOG_CONTENT" | tr -d '[:space:]')" ]; then
    echo "WARNING: No changelog content extracted for version $VERSION" >&2
    CHANGELOG_CONTENT="Release $VERSION"
fi

echo "Extracted $(echo "$CHANGELOG_CONTENT" | wc -l) lines of changelog content"

RELEASED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if command -v jq &>/dev/null; then
    PAYLOAD=$(jq -n \
        --arg product "$PRODUCT_NAME" \
        --arg version "$VERSION" \
        --arg released_at "$RELEASED_AT" \
        --arg changelog "$CHANGELOG_CONTENT" \
        --arg download_url "$DOWNLOAD_URL" \
        '{
            product: $product,
            version: $version,
            released_at: $released_at,
            changelog: $changelog,
            download_url: (if $download_url == "" then null else $download_url end)
        }')
else
    ESCAPED_CHANGELOG=$(echo "$CHANGELOG_CONTENT" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null || echo "\"$VERSION release\"")
    PAYLOAD="{\"product\":\"$PRODUCT_NAME\",\"version\":\"$VERSION\",\"released_at\":\"$RELEASED_AT\",\"changelog\":$ESCAPED_CHANGELOG"
    [ -n "$DOWNLOAD_URL" ] && PAYLOAD+=",\"download_url\":\"$DOWNLOAD_URL\""
    PAYLOAD+="}"
fi

echo "Uploading changelog to $API_URL..."

trap - ERR
set +e
HTTP_CODE=$(curl -sS -o /tmp/changelog-response.txt -w "%{http_code}" \
    --connect-timeout 10 --max-time 30 \
    -X POST "$API_URL" \
    -H "Authorization: Bearer $CHANGELOG_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")
CURL_EXIT=$?
set -e
trap 'echo "ERROR at line ${LINENO}: ${BASH_COMMAND}" >&2' ERR

RESPONSE=$(cat /tmp/changelog-response.txt 2>/dev/null || echo "")

if [ "$CURL_EXIT" -ne 0 ]; then
    echo "WARNING: curl failed to reach $API_URL (exit $CURL_EXIT); skipping upload" >&2
    echo "Response (if any): $RESPONSE" >&2
    exit 0
fi

if [ "$HTTP_CODE" -eq 201 ] || [ "$HTTP_CODE" -eq 200 ]; then
    echo "SUCCESS: Changelog uploaded (HTTP $HTTP_CODE)"
    echo "Response: $RESPONSE"
else
    echo "ERROR: Upload failed (HTTP $HTTP_CODE)" >&2
    echo "Response: $RESPONSE" >&2
    exit 1
fi
