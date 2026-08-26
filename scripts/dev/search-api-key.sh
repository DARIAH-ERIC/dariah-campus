#!/bin/sh

set -eu

if [ $# -lt 1 ]; then
	echo "Usage: $0 <search-api-key>"
	exit 1
fi

TYPESENSE_SEARCH_API_KEY=$1

escape_sed_replacement() {
	printf '%s' "$1" | sed 's/[&|\\]/\\&/g'
}

set_env_value() {
	KEY=$1
	VALUE=$(escape_sed_replacement "$2")
	FILE=$3

	sed -i -E "s|^${KEY}=.*$|${KEY}=\"${VALUE}\"|" "$FILE"
}

ENV_FILE=./docker/.env

set_env_value TYPESENSE_SEARCH_API_KEY "$TYPESENSE_SEARCH_API_KEY" "$ENV_FILE"

ENV_FILE=./.env.local

set_env_value NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY "$TYPESENSE_SEARCH_API_KEY" "$ENV_FILE"
