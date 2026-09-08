#!/bin/sh

set -eu

pnpm search:collections:create
echo "✓ Created search collections."

TYPESENSE_SEARCH_API_KEY=$(pnpm --silent search:api-keys:generate --raw)
echo "✓ Generated search api key."

sh ./scripts/dev/search-api-key.sh "$TYPESENSE_SEARCH_API_KEY"
echo "✓ Updated environment variables."
