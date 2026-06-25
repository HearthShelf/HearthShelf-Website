#!/bin/bash
# Smart Changelog Generator with AI Summaries (HearthShelf)
#
# Generates an intelligent changelog that:
# - Detects alpha builds (unreleased commits since the last tag)
# - Shows releases from the last month
# - Categorizes commits by type (Features, Fixes, Changes, etc.)
# - Generates two AI summaries: monthly overview and current release
#
# This is a generic (non-WoW) port: the product name comes from PRODUCT_NAME
# (env) or .changelog.yml, falling back to the git repo directory name.
#
# Usage: ./generate-changelog.sh [output_file]
#   output_file: Path to output changelog file (default: CHANGELOG.md)
#
# Environment variables:
#   GEMINI_API_KEY: Google Gemini API key for AI summaries (optional)
#   GITHUB_REF: GitHub ref (refs/tags/vX.Y.Z for tags, refs/heads/main for branch)
#   PRODUCT_NAME: Override product name (auto-detected if not set)
#   PRODUCT_DESCRIPTION: Short description used in AI prompts (optional)

OUTPUT_FILE="${1:-CHANGELOG.md}"
MONTH_AGO_SECONDS=$((30 * 24 * 60 * 60))

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1" >&2; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_debug() { echo -e "${BLUE}[DEBUG]${NC} $1" >&2; }

set -eE
trap 'log_error "FAILED at ${BASH_SOURCE[0]}:${LINENO} - command: ${BASH_COMMAND} (exit code $?)"' ERR

# === PRODUCT NAME & CONFIG AUTO-DETECTION ===

load_config() {
    local config=".changelog.yml"
    if [ ! -f "$config" ]; then return; fi

    log_info "Loading config from $config..."
    [ -z "$PRODUCT_NAME" ] && PRODUCT_NAME=$(grep "^product-name:" "$config" | sed 's/^product-name: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | sed 's/^ *//;s/ *$//')
    [ -z "$PRODUCT_DESCRIPTION" ] && PRODUCT_DESCRIPTION=$(grep "^product-description:" "$config" | sed 's/^product-description: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | sed 's/^ *//;s/ *$//')
    [ -z "$DOWNLOAD_URL" ] && DOWNLOAD_URL=$(grep "^download-url:" "$config" | sed 's/^download-url: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | sed 's/^ *//;s/ *$//')
    return 0
}

detect_product_name() {
    if [ -n "$PRODUCT_NAME" ]; then return; fi
    load_config
    if [ -n "$PRODUCT_NAME" ]; then return; fi
    PRODUCT_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")
}

detect_product_name
load_config

if [ -z "$GH_ISSUES_URL" ] && [ -n "$GITHUB_REPOSITORY" ]; then
    GH_ISSUES_URL="https://github.com/${GITHUB_REPOSITORY}/issues"
fi

log_info "Product name: $PRODUCT_NAME"
[ -n "$PRODUCT_DESCRIPTION" ] && log_info "Description: $PRODUCT_DESCRIPTION"

json_escape() {
    local input="$1"
    if command -v jq &> /dev/null; then
        echo "$input" | jq -Rs .
    else
        python -c "import json, sys; print(json.dumps(sys.stdin.read()))" <<< "$input"
    fi
}

categorize_commit() {
    local msg="$1"
    local msg_lower=$(echo "$msg" | tr '[:upper:]' '[:lower:]')

    if [[ "$msg" =~ ^(feat|feature|enhancement)[:\ ] ]] || [[ "$msg" =~ ^NEW: ]]; then
        echo "feature"; return
    elif [[ "$msg" =~ ^(fix|bug|bugfix)[:\ ] ]]; then
        echo "fix"; return
    elif [[ "$msg" =~ ^(chore|refactor|style|perf)[:\ ] ]]; then
        echo "change"; return
    elif [[ "$msg" =~ ^(docs|documentation)[:\ ] ]]; then
        echo "docs"; return
    elif [[ "$msg" =~ ^(breaking|BREAKING)[:\ ] ]]; then
        echo "breaking"; return
    fi

    if [[ "$msg_lower" =~ ^fix(es|ed|ing)?[[:space:]:\-] ]]; then echo "fix"; return; fi
    if [[ "$msg_lower" =~ ^(add(s|ed|ing)?|new|implement(s|ed|ing)?)[[:space:]:\-] ]]; then echo "feature"; return; fi
    if [[ "$msg_lower" =~ ^(improve(s|d|ing)?|enhance(s|d|ing)?|update(s|d|ing)?)[[:space:]:\-] ]]; then echo "change"; return; fi
    if [[ "$msg_lower" =~ ^(refactor(s|ed|ing)?|cleanup|clean[[:space:]]up|reorganize(s|d)?|simplif(y|ies|ied))[[:space:]:\-] ]]; then echo "change"; return; fi
    if [[ "$msg_lower" =~ ^(migrate(s|d)?|move(s|d)?)[[:space:]:\-] ]]; then echo "change"; return; fi
    if [[ "$msg_lower" =~ ^(remove(s|d)?|delete(s|d)?)[[:space:]:\-] ]]; then echo "change"; return; fi
    if [[ "$msg_lower" =~ ^integrate(s|d)?[[:space:]:\-] ]]; then echo "feature"; return; fi
    if [[ "$msg_lower" =~ ^(monitor|track|respect)[[:space:]:\-] ]]; then echo "feature"; return; fi
    if [[ "$msg_lower" =~ ^(silence|suppress)[[:space:]:\-] ]]; then echo "fix"; return; fi
    if [[ "$msg_lower" =~ ^(protect(s)?|ensure(s)?|guard(s)?)[[:space:]:\-] ]]; then echo "fix"; return; fi
    if [[ "$msg_lower" =~ ^register(s|ed)?[[:space:]:\-] ]]; then echo "feature"; return; fi
    if [[ "$msg_lower" =~ ^attempt[[:space:]:\-] ]]; then echo "fix"; return; fi
    if [[ "$msg_lower" =~ ^(switch|replace(s|d)?|bundle(s|d)?)[[:space:]:\-] ]]; then echo "change"; return; fi

    if [[ "$msg" =~ ^[A-Z][a-zA-Z]+:[[:space:]] ]]; then
        local after_prefix=$(echo "$msg" | sed -E 's/^[A-Z][a-zA-Z]+:[[:space:]]//')
        local after_lower=$(echo "$after_prefix" | tr '[:upper:]' '[:lower:]')
        if [[ "$after_lower" =~ ^(fix|fixes|fixed|fixing) ]]; then echo "fix"; return;
        elif [[ "$after_lower" =~ ^(add|adds|added|adding|new|implement) ]]; then echo "feature"; return;
        else echo "change"; return; fi
    fi

    if [[ "$msg_lower" =~ ^define(s|d)?[[:space:]:\-] ]]; then echo "feature"; return; fi

    echo "other"
}

clean_commit_message() {
    local msg="$1"
    msg=$(echo "$msg" | sed -E 's/^(feat|feature|fix|bug|bugfix|chore|refactor|style|perf|docs|documentation|breaking|BREAKING|NEW|enhancement|new):[ ]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Fixes|Fixed|Fixing)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Fix[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Adds|Added|Adding)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Add[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Implements|Implemented|Implementing)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Implement[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Improves|Improved|Improving)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Improve[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Enhances|Enhanced|Enhancing)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Enhance[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Updates|Updated|Updating)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Update[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Refactors|Refactored|Refactoring)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^Refactor[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Cleanup|Clean up)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Removes|Removed|Remove)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(Moves|Moved|Move)[[:space:]:\-]+//i')
    msg=$(echo "$msg" | sed -E 's/^(.)/\U\1/')
    echo "$msg"
}

get_commits_subjects() {
    local range="$1"
    local output_file="$2"
    if [ -n "$range" ]; then
        git log "$range" --pretty=format:"%s" --no-merges > "$output_file" 2>/dev/null
    fi
}

get_commits_with_body_for_ai() {
    local range="$1"
    local COMMIT_DELIM="<<<COMMIT_END>>>"
    local BODY_DELIM="<<<BODY>>>"
    if [ -n "$range" ]; then
        git log "$range" --pretty=format:"%s${BODY_DELIM}%b${COMMIT_DELIM}" --no-merges 2>/dev/null | \
        python3 -c "
import sys
COMMIT_DELIM = '<<<COMMIT_END>>>'
BODY_DELIM = '<<<BODY>>>'
content = sys.stdin.read()
for commit in content.split(COMMIT_DELIM):
    commit = commit.strip()
    if not commit: continue
    if BODY_DELIM in commit:
        subject, body = commit.split(BODY_DELIM, 1)
    else:
        subject, body = commit, ''
    subject, body = subject.strip(), body.strip()
    if not subject: continue
    print(f'- {subject}')
    if body:
        for line in [l.strip() for l in body.split('\n') if l.strip()][:5]:
            print(f'  {line}')
        print()
"
    fi
}

generate_ai_summary_gemini() {
    local commits_text="$1"
    local prompt_type="$2"
    local api_key="$GEMINI_API_KEY"

    if [ -z "$api_key" ]; then
        log_warn "GEMINI_API_KEY not set, skipping AI summary"
        return 1
    fi

    local product_context="$PRODUCT_NAME"
    if [ -n "$PRODUCT_DESCRIPTION" ]; then
        product_context="$PRODUCT_NAME ($PRODUCT_DESCRIPTION)"
    fi

    if [ "$prompt_type" = "month" ]; then
        local prompt="You are writing release notes for $product_context. Summarize the following changelog from the last month in 2-3 short sentences. Be direct and get straight to the details - no greetings, no filler phrases. Just state what was added, fixed, or changed. Write for a 6th grade reading level.

Changes from last month:
$commits_text"
    else
        local prompt="You are writing release notes for $product_context. Summarize this specific release in 1-2 short sentences. Be direct and get straight to the details - no greetings, no filler phrases. Just state what was added, fixed, or changed. Write for a 6th grade reading level.

Changes in this release:
$commits_text"
    fi

    prompt=$(json_escape "$prompt")
    local json_request="{\"contents\":[{\"parts\":[{\"text\":$prompt}]}]}"
    local temp_request=$(mktemp)
    echo "$json_request" > "$temp_request"

    log_info "Calling Gemini API for $prompt_type summary..."
    local response=$(curl -s -w "\n%{http_code}" --max-time 30 \
        -H "Content-Type: application/json" \
        -d "@$temp_request" \
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=$api_key")

    rm -f "$temp_request"

    local http_code=$(echo "$response" | tail -n1)
    local response_body=$(echo "$response" | head -n-1)

    if [ "$http_code" != "200" ]; then
        log_error "Gemini API returned HTTP $http_code"
        return 1
    fi

    local summary=$(python -c "
import json, sys
try:
    data = json.loads(sys.stdin.read())
    print(data['candidates'][0]['content']['parts'][0]['text'])
except (KeyError, IndexError, json.JSONDecodeError):
    pass
" <<< "$response_body" 2>/dev/null)

    if [ -z "$summary" ]; then
        log_error "Failed to parse Gemini API response"
        return 1
    fi

    echo "$summary"
    return 0
}

format_categorized_commits() {
    local commit_file="$1"
    local -a features=() fixes=() changes=() docs=() breaking=() others=()

    while IFS= read -r line || [ -n "$line" ]; do
        if [ -z "$line" ]; then continue; fi
        local category=$(categorize_commit "$line")
        local clean_msg=$(clean_commit_message "$line")
        case "$category" in
            feature) features+=("$clean_msg") ;;
            fix) fixes+=("$clean_msg") ;;
            change) changes+=("$clean_msg") ;;
            docs) docs+=("$clean_msg") ;;
            breaking) breaking+=("$clean_msg") ;;
            *) others+=("$clean_msg") ;;
        esac
    done < "$commit_file"

    if [ ${#breaking[@]} -gt 0 ]; then
        echo "### Breaking Changes"; for item in "${breaking[@]}"; do echo "- $item"; done; echo ""
    fi
    if [ ${#features[@]} -gt 0 ]; then
        echo "### Features"; for item in "${features[@]}"; do echo "- $item"; done; echo ""
    fi
    if [ ${#fixes[@]} -gt 0 ]; then
        echo "### Fixes"; for item in "${fixes[@]}"; do echo "- $item"; done; echo ""
    fi
    if [ ${#changes[@]} -gt 0 ]; then
        echo "### Changes"; for item in "${changes[@]}"; do echo "- $item"; done; echo ""
    fi
    if [ ${#docs[@]} -gt 0 ]; then
        echo "### Documentation"; for item in "${docs[@]}"; do echo "- $item"; done; echo ""
    fi
    if [ ${#others[@]} -gt 0 ]; then
        echo "### Other"; for item in "${others[@]}"; do echo "- $item"; done; echo ""
    fi
}

# === Main ===

log_info "Generating smart changelog for $PRODUCT_NAME..."
log_info "Output file: $OUTPUT_FILE"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Not in a git repository!"
    exit 1
fi

IS_TAG=false
CURRENT_TAG=""
if [[ "$GITHUB_REF" =~ ^refs/tags/ ]]; then
    IS_TAG=true
    CURRENT_TAG=$(echo "$GITHUB_REF" | sed 's|refs/tags/||')
    log_info "Detected tag release: $CURRENT_TAG"
else
    log_info "Detected alpha build (branch push)"
fi

NOW=$(date +%s)
MONTH_AGO=$(($NOW - $MONTH_AGO_SECONDS))

echo "# $PRODUCT_NAME Changelog" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

MONTH_SUMMARY_MARKER="<!-- MONTH_SUMMARY_PLACEHOLDER -->"
RELEASE_SUMMARY_MARKER="<!-- RELEASE_SUMMARY_PLACEHOLDER -->"

TEMP_MONTH_COMMITS=$(mktemp)
TEMP_RELEASE_COMMITS=$(mktemp)
TEMP_ALPHA_COMMITS=$(mktemp)

if [ "$IS_TAG" = false ]; then
    LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    if [ -n "$LATEST_TAG" ]; then
        log_info "Checking for unreleased commits since $LATEST_TAG..."
        get_commits_subjects "$LATEST_TAG..HEAD" "$TEMP_ALPHA_COMMITS"
    else
        log_info "No tags found, collecting all commits as unreleased..."
        git log --pretty=format:"%s" --no-merges > "$TEMP_ALPHA_COMMITS" 2>/dev/null
    fi

    if [ -s "$TEMP_ALPHA_COMMITS" ]; then
        ALPHA_COUNT=$(grep -c "." "$TEMP_ALPHA_COMMITS" 2>/dev/null || echo "0")
        log_info "Found $ALPHA_COUNT unreleased commits"
        echo "## Alpha Build - Unreleased Changes" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "_These changes are not yet in a release. This is a development build._" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "$RELEASE_SUMMARY_MARKER" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        format_categorized_commits "$TEMP_ALPHA_COMMITS" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$TEMP_ALPHA_COMMITS" > "$TEMP_RELEASE_COMMITS"
    fi
fi

echo "## Last Month Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "$MONTH_SUMMARY_MARKER" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

log_info "Fetching tags from last month..."
ALL_TAGS=$(git tag --sort=-version:refname)

RECENT_TAGS=()
for tag in $ALL_TAGS; do
    TAG_DATE=$(git log -1 --format=%at "$tag" 2>/dev/null)
    if [ -n "$TAG_DATE" ] && [ "$TAG_DATE" -ge "$MONTH_AGO" ]; then
        RECENT_TAGS+=("$tag")
    fi
done

log_info "Found ${#RECENT_TAGS[@]} releases from last month"

if [ "$IS_TAG" = true ] && [ "${RECENT_TAGS[0]}" = "$CURRENT_TAG" ]; then
    echo "## This Release" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "$RELEASE_SUMMARY_MARKER" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

ALL_TAGS_ARRAY=()
while IFS= read -r tag; do
    ALL_TAGS_ARRAY+=("$tag")
done <<< "$ALL_TAGS"

for i in "${!RECENT_TAGS[@]}"; do
    TAG="${RECENT_TAGS[$i]}"
    TAG_DATE=$(git log -1 --format=%ai "$TAG" | cut -d' ' -f1)
    log_info "Processing version $TAG ($TAG_DATE)..."

    PREV_TAG=""
    for j in "${!ALL_TAGS_ARRAY[@]}"; do
        if [ "${ALL_TAGS_ARRAY[$j]}" = "$TAG" ]; then
            NEXT_IDX=$((j + 1))
            if [ $NEXT_IDX -lt ${#ALL_TAGS_ARRAY[@]} ]; then
                PREV_TAG="${ALL_TAGS_ARRAY[$NEXT_IDX]}"
            fi
            break
        fi
    done

    TEMP_TAG_COMMITS=$(mktemp)
    if [ -n "$PREV_TAG" ]; then
        get_commits_subjects "$PREV_TAG..$TAG" "$TEMP_TAG_COMMITS"
    else
        log_warn "No previous tag found for $TAG, skipping to avoid full history"
        echo "" > "$TEMP_TAG_COMMITS"
    fi

    cat "$TEMP_TAG_COMMITS" >> "$TEMP_MONTH_COMMITS"

    if [ "$IS_TAG" = true ] && [ "$TAG" = "$CURRENT_TAG" ]; then
        cat "$TEMP_TAG_COMMITS" > "$TEMP_RELEASE_COMMITS"
    fi

    echo "## Version $TAG ($TAG_DATE)" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    if [ -s "$TEMP_TAG_COMMITS" ]; then
        format_categorized_commits "$TEMP_TAG_COMMITS" >> "$OUTPUT_FILE"
    else
        echo "- No changes recorded" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    rm -f "$TEMP_TAG_COMMITS"
done

if [ "$IS_TAG" = true ]; then
    log_info "Generating AI summaries for tag release..."

    if [ -s "$TEMP_MONTH_COMMITS" ]; then
        MONTH_RANGE=""
        if [ ${#RECENT_TAGS[@]} -gt 0 ]; then
            OLDEST_TAG="${RECENT_TAGS[-1]}"
            for j in "${!ALL_TAGS_ARRAY[@]}"; do
                if [ "${ALL_TAGS_ARRAY[$j]}" = "$OLDEST_TAG" ]; then
                    NEXT_IDX=$((j + 1))
                    if [ $NEXT_IDX -lt ${#ALL_TAGS_ARRAY[@]} ]; then
                        MONTH_RANGE="${ALL_TAGS_ARRAY[$NEXT_IDX]}..${RECENT_TAGS[0]}"
                    fi
                    break
                fi
            done
        fi

        if [ -n "$MONTH_RANGE" ]; then
            MONTH_COMMITS_FULL=$(get_commits_with_body_for_ai "$MONTH_RANGE")
        else
            MONTH_COMMITS_FULL=$(cat "$TEMP_MONTH_COMMITS")
        fi

        MONTH_SUMMARY=$(generate_ai_summary_gemini "$MONTH_COMMITS_FULL" "month") || MONTH_SUMMARY=""
        if [ -n "$MONTH_SUMMARY" ]; then
            log_info "Monthly summary generated!"
            sed -i "s|$MONTH_SUMMARY_MARKER|$MONTH_SUMMARY|g" "$OUTPUT_FILE"
        else
            sed -i "/$MONTH_SUMMARY_MARKER/d" "$OUTPUT_FILE"
        fi
    else
        sed -i "/$MONTH_SUMMARY_MARKER/d" "$OUTPUT_FILE"
    fi

    if [ -s "$TEMP_RELEASE_COMMITS" ]; then
        RELEASE_COMMIT_COUNT=$(grep -c "." "$TEMP_RELEASE_COMMITS" 2>/dev/null || echo "0")
        if [ "$RELEASE_COMMIT_COUNT" -gt 3 ]; then
            RELEASE_PREV_TAG=""
            for j in "${!ALL_TAGS_ARRAY[@]}"; do
                if [ "${ALL_TAGS_ARRAY[$j]}" = "$CURRENT_TAG" ]; then
                    NEXT_IDX=$((j + 1))
                    if [ $NEXT_IDX -lt ${#ALL_TAGS_ARRAY[@]} ]; then
                        RELEASE_PREV_TAG="${ALL_TAGS_ARRAY[$NEXT_IDX]}"
                    fi
                    break
                fi
            done

            if [ -n "$RELEASE_PREV_TAG" ]; then
                RELEASE_COMMITS_FULL=$(get_commits_with_body_for_ai "$RELEASE_PREV_TAG..$CURRENT_TAG")
            else
                RELEASE_COMMITS_FULL=$(cat "$TEMP_RELEASE_COMMITS")
            fi

            RELEASE_SUMMARY=$(generate_ai_summary_gemini "$RELEASE_COMMITS_FULL" "release") || RELEASE_SUMMARY=""
            if [ -n "$RELEASE_SUMMARY" ]; then
                log_info "Release summary generated!"
                sed -i "s|$RELEASE_SUMMARY_MARKER|$RELEASE_SUMMARY|g" "$OUTPUT_FILE"
            else
                sed -i "/$RELEASE_SUMMARY_MARKER/d" "$OUTPUT_FILE"
            fi
        else
            log_info "Skipping release summary (only $RELEASE_COMMIT_COUNT changes)"
            sed -i "/$RELEASE_SUMMARY_MARKER/d" "$OUTPUT_FILE"
        fi
    else
        sed -i "/$RELEASE_SUMMARY_MARKER/d" "$OUTPUT_FILE"
    fi
else
    log_info "Skipping AI summaries for alpha build"
    sed -i "/$MONTH_SUMMARY_MARKER/d" "$OUTPUT_FILE"
    sed -i "/$RELEASE_SUMMARY_MARKER/d" "$OUTPUT_FILE"
fi

rm -f "$TEMP_MONTH_COMMITS" "$TEMP_RELEASE_COMMITS" "$TEMP_ALPHA_COMMITS"

if [ -n "$DOWNLOAD_URL" ] || [ -n "$GH_ISSUES_URL" ]; then
    log_info "Adding links footer..."
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "## Links" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    [ -n "$DOWNLOAD_URL" ] && echo "- **Download**: [$DOWNLOAD_URL]($DOWNLOAD_URL)" >> "$OUTPUT_FILE"
    [ -n "$GH_ISSUES_URL" ] && echo "- **Support**: [Report Issues]($GH_ISSUES_URL)" >> "$OUTPUT_FILE"
fi

log_info "Smart changelog generated successfully: $OUTPUT_FILE"
log_info "Preview (first 50 lines):"
head -n 50 "$OUTPUT_FILE"

exit 0
