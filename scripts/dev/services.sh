#!/bin/sh

set -eu

DEVCONTAINER_DIR="./docker"
ENV_FILE="$DEVCONTAINER_DIR/.env"

if [ $# -lt 1 ]; then
	echo "Usage: $0 <start|stop> [service1 service2 ...]"
	exit 1
fi

ACTION=$1
shift

ALL_SERVICES=""
for file in "$DEVCONTAINER_DIR"/docker-compose.*.yaml; do
	name=${file##*/}
	service=${name#docker-compose.}
	service=${service%.yaml}
	[ "$service" = "apps" ] && continue
	ALL_SERVICES="$ALL_SERVICES $service"
done

if [ $# -eq 0 ]; then
	SERVICES=$ALL_SERVICES
else
	SERVICES=$*
fi

set --

if [ -e "$ENV_FILE" ]; then
	set -- "$@" --env-file "$ENV_FILE"
fi

for service in $SERVICES; do
	file="$DEVCONTAINER_DIR/docker-compose.$service.yaml"
	if [ ! -f "$file" ]; then
		echo "Unknown service: $service"
		exit 1
	fi
	set -- "$@" --file "$file"
done

case "$ACTION" in
	start)
		echo "Starting services:$SERVICES"
		docker compose "$@" up --detach
		;;
	stop)
		echo "Stopping services:$SERVICES"
		docker compose "$@" down --volumes
		;;
	*)
		echo "Unknown action: $ACTION. Use 'start' or 'stop'."
		exit 1
		;;
esac

echo "✓ Done."
