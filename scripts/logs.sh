#!/bin/bash
# View Audiobookshelf logs

set -e

cd "$(dirname "$0")/.."

# Check if production or dev
if docker ps | grep -q "audiobookshelf-prod"; then
    echo "Viewing production logs (Ctrl+C to exit)..."
    docker compose -f docker-compose.prod.yml logs -f audiobookshelf
elif docker ps | grep -q "audiobookshelf-dev"; then
    echo "Viewing development logs (Ctrl+C to exit)..."
    docker compose -f docker-compose.yml logs -f audiobookshelf
else
    echo "No Audiobookshelf container is running."
    exit 1
fi

