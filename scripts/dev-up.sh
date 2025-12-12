#!/bin/bash
# Start Audiobookshelf in development mode

set -e

cd "$(dirname "$0")/.."

echo "Starting Audiobookshelf in development mode..."
docker compose -f docker-compose.yml up -d

echo "Audiobookshelf is starting..."
echo "Access it at: http://localhost:${ABS_PORT:-13378}"
echo ""
echo "To view logs: ./scripts/logs.sh"
echo "To stop: ./scripts/dev-down.sh"

