#!/bin/bash
# Update Audiobookshelf and Caddy images, then restart

set -e

cd "$(dirname "$0")/.."

echo "Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

echo "Restarting containers..."
docker compose -f docker-compose.prod.yml up -d

echo "Update complete!"
echo ""
echo "To view logs: ./scripts/logs.sh"

