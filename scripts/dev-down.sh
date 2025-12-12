#!/bin/bash
# Stop Audiobookshelf in development mode

set -e

cd "$(dirname "$0")/.."

echo "Stopping Audiobookshelf..."
docker compose -f docker-compose.yml down

echo "Audiobookshelf stopped."

