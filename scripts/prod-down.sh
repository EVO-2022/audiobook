#!/bin/bash
# Stop Audiobookshelf in production mode

set -e

cd "$(dirname "$0")/.."

echo "Stopping Audiobookshelf production environment..."
docker compose -f docker-compose.prod.yml down

echo "Audiobookshelf stopped."

