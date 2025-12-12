# Audiobook Server - Quick Start Guide

## Installation Complete! 🎉

Your Audiobookshelf server is configured and ready to deploy. Follow these steps to get it running:

## Step 1: Install and Start Services

Run the setup script:

```bash
cd /home/evo/audiobook
./setup-services.sh
```

This will:
- Install systemd services
- Enable auto-start on boot
- Start the audiobook server
- Start the Cloudflare tunnel

## Step 2: Set Up DNS (IMPORTANT!)

Your domain `rhonda.onl` needs to be added to Cloudflare first.

**Read the detailed instructions**: `/home/evo/audiobook/DNS_SETUP.md`

**Quick summary**:
1. Add `rhonda.onl` to Cloudflare dashboard
2. Update nameservers at Porkbun to Cloudflare's nameservers
3. Wait 15-30 minutes for DNS propagation
4. Run tunnel DNS route commands (in DNS_SETUP.md)

## Step 3: Access Your Server

Once DNS is set up and propagated:

🌐 **https://rhonda.onl**

## Initial Setup in Audiobookshelf

1. Visit https://rhonda.onl
2. Create your admin account (first user)
3. Create a library pointing to `/audiobooks`
4. Upload audiobooks to `/home/evo/audiobook/media/audiobooks/`
5. Scan library
6. Create user accounts for others

## Directory Structure

```
/home/evo/audiobook/
├── media/
│   ├── audiobooks/     ← Put your audiobook files here
│   └── podcasts/       ← Put podcast files here (optional)
├── data/
│   ├── config/         ← Audiobookshelf config (auto-generated)
│   └── metadata/       ← Library metadata (auto-generated)
└── scripts/            ← Helper scripts
```

## Common Commands

### Service Management
```bash
# Check status
sudo systemctl status audiobook.service
sudo systemctl status cloudflared-audiobook.service

# Restart services
sudo systemctl restart audiobook.service
sudo systemctl restart cloudflared-audiobook.service

# View logs
sudo journalctl -u audiobook.service -f
sudo journalctl -u cloudflared-audiobook.service -f
```

### Docker Commands
```bash
# View running containers
docker ps

# View logs
docker logs audiobookshelf-prod -f
docker logs caddy-proxy -f

# Restart containers
cd /home/evo/audiobook
docker-compose -f docker-compose.prod.yml restart
```

### Backup
```bash
# Backup config and metadata (excludes media files)
cd /home/evo/audiobook
./scripts/backup.sh

# Backups saved to: ./backups/
```

## Adding Audiobooks

1. Copy files to media directory:
   ```bash
   cp -r /path/to/audiobooks/* /home/evo/audiobook/media/audiobooks/
   ```

2. Recommended folder structure:
   ```
   audiobooks/
   ├── Author Name/
   │   └── Book Title/
   │       ├── Chapter 01.mp3
   │       ├── Chapter 02.mp3
   │       └── cover.jpg
   ```

3. Rescan library in Audiobookshelf web UI

## System Behavior

- ✅ **Auto-start on boot**: Both services start automatically
- ✅ **Auto-restart on failure**: Services restart if they crash
- ✅ **24/7 operation**: Runs continuously
- ✅ **No port forwarding needed**: Cloudflare Tunnel handles everything
- ✅ **HTTPS automatic**: Cloudflare provides SSL

## Troubleshooting

### Can't access https://rhonda.onl
1. Check DNS is set up (see DNS_SETUP.md)
2. Verify services are running: `sudo systemctl status audiobook.service`
3. Check tunnel: `sudo systemctl status cloudflared-audiobook.service`

### Local access (if DNS not ready)
You can access locally while waiting for DNS:
```bash
# Get your local IP
ip addr | grep "inet "

# Access via: http://YOUR_LOCAL_IP:80
```

### Services not starting
```bash
# Check logs
sudo journalctl -u audiobook.service -n 50
sudo journalctl -u cloudflared-audiobook.service -n 50

# Restart
sudo systemctl restart audiobook.service
sudo systemctl restart cloudflared-audiobook.service
```

## Files Created

- `/etc/systemd/system/audiobook.service` - Audiobook service
- `/etc/systemd/system/cloudflared-audiobook.service` - Tunnel service
- `/home/evo/.cloudflared/audiobook-config.yml` - Tunnel config
- `/home/evo/audiobook/.env` - Environment variables

## What's Running

| Service | Description | Port | Auto-Start |
|---------|-------------|------|------------|
| audiobookshelf-prod | Main audiobook server | Internal | ✅ |
| caddy-proxy | Reverse proxy | 80, 443 | ✅ |
| cloudflared-audiobook | Cloudflare tunnel | N/A | ✅ |

## Support

- Audiobookshelf Docs: https://www.audiobookshelf.org/docs
- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/

---

**Next Step**: Run `./setup-services.sh` to start everything!
