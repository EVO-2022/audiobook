#!/bin/bash
# Start Audiobookshelf in production mode

set -e

cd "$(dirname "$0")/.."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and fill in the required values."
    exit 1
fi

# Source .env to check variables
source .env

# Check if using public domain mode
if [ -n "$DOMAIN" ] && [ -n "$EMAIL" ]; then
    echo "Starting Audiobookshelf in production mode (public domain: $DOMAIN)..."
    
    # Replace domain placeholder in Caddyfile if it exists
    if grep -q "YOUR_DOMAIN_HERE" Caddyfile 2>/dev/null; then
        echo "Updating Caddyfile with domain: $DOMAIN"
        sed -i.bak "s/YOUR_DOMAIN_HERE/$DOMAIN/g" Caddyfile
        rm -f Caddyfile.bak
    elif ! grep -q "$DOMAIN" Caddyfile 2>/dev/null; then
        echo "WARNING: Caddyfile may not be configured with your domain."
        echo "Please ensure Caddyfile contains: $DOMAIN"
    fi
    
    docker compose -f docker-compose.prod.yml up -d
    
    echo "Audiobookshelf is starting..."
    echo "Access it at: https://$DOMAIN"
    echo ""
    echo "Caddy will automatically obtain SSL certificate from Let's Encrypt."
    echo "This may take a few minutes on first run."
else
    echo "WARNING: DOMAIN or EMAIL not set in .env"
    echo "If using Cloudflare Tunnel, this is OK."
    echo "Starting with local Caddyfile..."
    
    # Use local Caddyfile if domain not set
    if [ -f Caddyfile.local ]; then
        cp Caddyfile.local Caddyfile
    fi
    
    docker compose -f docker-compose.prod.yml up -d
    
    echo "Audiobookshelf is starting..."
    echo "Access it at: http://localhost (or via Cloudflare Tunnel)"
fi

echo ""
echo "To view logs: ./scripts/logs.sh"
echo "To stop: ./scripts/prod-down.sh"

