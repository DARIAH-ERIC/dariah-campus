#!/bin/sh

set -eu

TYPESENSE_ADMIN_API_KEY=$(openssl rand --hex 32)

set_env_value() {
	KEY=$1
	VALUE=$2
	FILE=$3

	sed -i -E "s|^${KEY}=.*$|${KEY}=\"${VALUE}\"|" "$FILE"
}

ENV_FILE=./docker/.env

if [ ! -f "$ENV_FILE" ]; then
	cp $ENV_FILE.example $ENV_FILE

	set_env_value TYPESENSE_ADMIN_API_KEY "$TYPESENSE_ADMIN_API_KEY" "$ENV_FILE"
fi

ENV_FILE=./.env.local

if [ ! -f "$ENV_FILE" ]; then
	cp $ENV_FILE.example $ENV_FILE

	set_env_value TYPESENSE_ADMIN_API_KEY "$TYPESENSE_ADMIN_API_KEY" "$ENV_FILE"
fi

echo "✓ Environment variables initialized."
