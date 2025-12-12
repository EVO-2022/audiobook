#!/bin/bash
# Setup script for Audiobook systemd services

echo "Installing systemd services..."

# Copy service files
sudo cp /home/evo/audiobook.service /etc/systemd/system/
sudo cp /home/evo/cloudflared-audiobook.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable services to start on boot
sudo systemctl enable audiobook.service
sudo systemctl enable cloudflared-audiobook.service

# Start the audiobook service
echo "Starting audiobook service..."
sudo systemctl start audiobook.service

# Wait for containers to be ready
echo "Waiting for containers to start..."
sleep 10

# Start cloudflared tunnel
echo "Starting Cloudflare tunnel..."
sudo systemctl start cloudflared-audiobook.service

# Check status
echo ""
echo "=== Service Status ==="
sudo systemctl status audiobook.service --no-pager
echo ""
sudo systemctl status cloudflared-audiobook.service --no-pager

echo ""
echo "=== Setup Complete ==="
echo "Audiobook server: Running on localhost:80"
echo "Cloudflare tunnel: Active"
echo ""
echo "Next steps:"
echo "1. Add rhonda.onl to Cloudflare (see DNS_SETUP.md)"
echo "2. Test access at https://rhonda.onl"
