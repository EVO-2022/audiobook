# Project Journal - Self-Hosted Audiobookshelf Setup

**Project Start Date:** December 12, 2025  
**Repository:** https://github.com/EVO-2022/audiobook  
**Purpose:** Elder-friendly self-hosted audiobook system for remote administration and mobile access

---

## Project Goals & Constraints

### Primary Objectives
- Self-hosted Audiobookshelf system
- No subscriptions, no Audible, no Echo
- Remote library management by admin
- Elder-friendly mobile access (iPhone app/web player)
- Simple, reliable, easy to maintain

### Technical Requirements
- Build locally on macOS first
- Deploy to Ubuntu server
- Docker-based deployment
- HTTPS access required
- Support both public domain and Cloudflare Tunnel options

---

## Development Timeline

### Phase 1: Initial Setup (December 12, 2025)

#### Files Created

**Core Configuration:**
- `docker-compose.yml` - Local development setup
  - Exposes Audiobookshelf on localhost:13378
  - Uses bind mounts for easy backup
  - Timezone: America/Chicago
  
- `docker-compose.prod.yml` - Production setup
  - Includes Caddy reverse proxy for HTTPS
  - Automatic Let's Encrypt SSL certificates
  - Network isolation with bridge network

**Reverse Proxy Configuration:**
- `Caddyfile` - Public domain configuration
  - Placeholder: `YOUR_DOMAIN_HERE` (auto-replaced by prod-up.sh)
  - Security headers (HSTS, X-Frame-Options, etc.)
  - Logging configured
  
- `Caddyfile.local` - Internal/local access
  - For Cloudflare Tunnel or local-only access
  - No TLS required

**Environment Configuration:**
- `.env.example` - Template for environment variables
- `.env` - Actual environment file (gitignored)
  - Variables: TZ, DOMAIN, EMAIL, ABS_PORT

**Management Scripts:**
- `scripts/dev-up.sh` - Start local development environment
- `scripts/dev-down.sh` - Stop local development
- `scripts/prod-up.sh` - Start production (handles domain substitution)
- `scripts/prod-down.sh` - Stop production
- `scripts/logs.sh` - View logs (auto-detects dev/prod)
- `scripts/update.sh` - Update Docker images and restart
- `scripts/backup.sh` - Backup config/metadata (excludes media)

**Documentation:**
- `README.md` - Comprehensive setup and usage guide
  - Local development instructions
  - Initial admin setup
  - User management (creating mom's account)
  - Adding audiobooks
  - Mobile access (iOS app + web player)
  - Elder-friendly configuration checklist
  - Production deployment (public domain + Cloudflare Tunnel)
  - Troubleshooting guide

**Directory Structure:**
- `data/config/` - Audiobookshelf configuration (gitignored)
- `data/metadata/` - Library metadata (gitignored)
- `data/caddy/` - Caddy data (gitignored)
- `media/audiobooks/` - Audiobook files (gitignored)
- `media/podcasts/` - Podcast files (gitignored)
- All directories include `.gitkeep` files to preserve structure

**Git Configuration:**
- `.gitignore` - Properly configured to:
  - Ignore `.env` file
  - Ignore data directories contents (but keep .gitkeep)
  - Ignore media directories contents (but keep .gitkeep)
  - Ignore logs and backups

### Phase 2: GitHub Repository Setup (December 12, 2025)

**Repository Initialization:**
- Initialized git repository
- Added remote: https://github.com/EVO-2022/audiobook.git
- Initial commit: "Initial commit: Self-hosted Audiobookshelf setup with elder-friendly configuration"
- Fixed `.gitignore` to properly handle directory exclusions
- Added `.gitkeep` files to preserve directory structure
- Pushed to GitHub successfully

**Files Pushed:**
- All configuration files
- All scripts (executable permissions preserved)
- Documentation
- Directory structure with .gitkeep files

### Phase 3: Production Deployment Configuration (December 12, 2025)

**Additional Files Added (via GitHub):**
- `QUICKSTART.md` - Quick start guide for rhonda.onl deployment
- `DNS_SETUP.md` - DNS configuration instructions
- `setup-services.sh` - Systemd service setup script

**Production Configuration:**
- Domain: `rhonda.onl`
- Deployment path: `/home/evo/audiobook`
- Cloudflare Tunnel integration
- Systemd services for auto-start

**Current Production State:**
- Services configured for Ubuntu server deployment
- Cloudflare Tunnel setup documented
- Systemd services ready for installation

---

## Technical Architecture

### Local Development
- **Port:** 13378 (configurable via ABS_PORT)
- **Access:** http://localhost:13378
- **Volumes:** Bind mounts to `./data/*` and `./media/*`
- **Network:** Bridge network (audiobookshelf-network)

### Production Deployment
- **Reverse Proxy:** Caddy 2
- **SSL:** Automatic Let's Encrypt certificates
- **Ports:** 80 (HTTP), 443 (HTTPS)
- **Alternative:** Cloudflare Tunnel (no open ports)
- **Services:** Docker Compose with systemd integration

### Container Images
- **Audiobookshelf:** `ghcr.io/advplyr/audiobookshelf:latest`
- **Caddy:** `caddy:2`

### Data Persistence
- Config: `./data/config` → `/config` in container
- Metadata: `./data/metadata` → `/metadata` in container
- Audiobooks: `./media/audiobooks` → `/audiobooks` in container
- Podcasts: `./media/podcasts` → `/podcasts` in container
- Caddy data: `./data/caddy` → `/data` and `/config` in Caddy container

---

## User Management Strategy

### Admin Account
- First user created during initial setup
- Full access to all settings and libraries
- Manages library content and user accounts

### Mom's Account (Elder-Friendly)
- Non-admin user role
- Access only to Audiobooks library (and optionally Podcasts)
- Simple password
- No access to settings or admin functions
- Optimized for mobile access

### Elder-Friendly Features
- Large text support (iOS settings + Safari zoom)
- Home screen shortcut on iPhone
- Simple library view
- Easy playback controls
- Sleep timer support

---

## Deployment Options

### Option A: Public Domain (Ports 80/443 Open)
**Requirements:**
- Domain name pointing to server IP
- Ports 80 and 443 open in firewall
- Email for Let's Encrypt notifications

**Setup:**
1. Configure DNS A record
2. Set DOMAIN and EMAIL in `.env`
3. Run `./scripts/prod-up.sh`
4. Caddy automatically obtains SSL certificate

### Option B: Cloudflare Tunnel (No Open Ports)
**Requirements:**
- Cloudflare account
- Domain managed by Cloudflare
- Cloudflare Tunnel installed

**Setup:**
1. Install cloudflared
2. Authenticate and create tunnel
3. Configure DNS route
4. Run tunnel service
5. Access via Cloudflare-provided HTTPS

---

## Current Status

### ✅ Completed
- [x] Local development environment configured
- [x] Production docker-compose with Caddy
- [x] Management scripts created
- [x] Comprehensive documentation
- [x] GitHub repository setup
- [x] Production deployment files (rhonda.onl)
- [x] Systemd service configuration
- [x] Cloudflare Tunnel integration

### 🔄 In Progress
- [ ] Production server deployment (Ubuntu)
- [ ] DNS configuration for rhonda.onl
- [ ] Initial admin account creation
- [ ] Mom's user account setup
- [ ] Library creation and audiobook upload

### 📋 Next Steps

1. **Server Setup:**
   - SSH into Ubuntu server
   - Clone repository: `git clone https://github.com/EVO-2022/audiobook.git`
   - Navigate to directory: `cd audiobook`
   - Create `.env` file with production values

2. **DNS Configuration:**
   - Follow `DNS_SETUP.md` instructions
   - Add domain to Cloudflare
   - Update nameservers
   - Wait for DNS propagation

3. **Service Installation:**
   - Run `./setup-services.sh` on server
   - This installs systemd services
   - Enables auto-start on boot

4. **Initial Configuration:**
   - Access https://rhonda.onl
   - Create admin account
   - Create Audiobooks library
   - Upload initial audiobooks to `./media/audiobooks/`
   - Rescan library

5. **User Setup:**
   - Create mom's user account (non-admin)
   - Assign Audiobooks library access
   - Configure elder-friendly settings
   - Test mobile access

6. **Ongoing Maintenance:**
   - Regular backups using `./scripts/backup.sh`
   - Updates using `./scripts/update.sh`
   - Monitor logs using `./scripts/logs.sh`

---

## Important Notes

### Security
- `.env` file is gitignored (contains sensitive data)
- SSL certificates managed automatically by Caddy
- Cloudflare Tunnel provides additional security layer
- No hardcoded secrets in repository

### Backup Strategy
- Config and metadata backed up via `backup.sh`
- Media files excluded from automated backups (too large)
- Manual media backup recommended for important content
- Backups stored in `./backups/` directory

### Maintenance
- Docker images updated via `update.sh` script
- Services auto-restart on failure (systemd)
- Logs accessible via `logs.sh` or `journalctl`
- Container health monitored by Docker

### File Organization
- Audiobookshelf prefers: `Author Name/Book Title/Chapter Files`
- Cover images supported (cover.jpg in book folder)
- Supported formats: MP3, M4B, M4A, FLAC, OGG, OPUS, WAV

---

## Troubleshooting Reference

### Common Issues
1. **Container won't start:** Check logs, verify ports not in use
2. **Can't access web interface:** Verify container running, check firewall
3. **SSL certificate issues:** Verify DNS, check Caddy logs
4. **Library not scanning:** Check file permissions, verify library path
5. **User can't log in:** Reset password, verify library access

### Useful Commands
```bash
# Check container status
docker ps

# View logs
./scripts/logs.sh
# or
docker logs audiobookshelf-prod -f

# Check services (production)
sudo systemctl status audiobook.service
sudo systemctl status cloudflared-audiobook.service

# Restart services
./scripts/prod-down.sh && ./scripts/prod-up.sh
# or
sudo systemctl restart audiobook.service
```

---

## Repository Structure

```
audiobook/
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production with Caddy
├── Caddyfile                   # Public domain Caddy config
├── Caddyfile.local             # Local/internal Caddy config
├── .env.example                # Environment template
├── .env                        # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── JOURNAL.md                  # This file
├── README.md                   # Main documentation
├── QUICKSTART.md               # Quick start guide
├── DNS_SETUP.md                # DNS configuration
├── setup-services.sh           # Systemd service installer
├── scripts/
│   ├── dev-up.sh              # Start dev
│   ├── dev-down.sh            # Stop dev
│   ├── prod-up.sh             # Start production
│   ├── prod-down.sh           # Stop production
│   ├── logs.sh                # View logs
│   ├── update.sh              # Update images
│   └── backup.sh              # Backup config/metadata
├── data/
│   ├── config/                # ABS config (gitignored)
│   ├── metadata/              # ABS metadata (gitignored)
│   └── caddy/                 # Caddy data (gitignored)
└── media/
    ├── audiobooks/            # Audiobook files (gitignored)
    └── podcasts/              # Podcast files (gitignored)
```

---

## Key Decisions Made

1. **Docker Compose over standalone Docker:** Easier management, better for multi-container setup
2. **Caddy over Nginx:** Automatic SSL, simpler configuration
3. **Bind mounts over named volumes:** Easier backups, direct file access
4. **Cloudflare Tunnel option:** Security without opening ports
5. **Separate dev/prod compose files:** Clear separation of concerns
6. **Script-based management:** Consistent, repeatable operations
7. **Comprehensive documentation:** Self-service troubleshooting

---

## Lessons Learned

1. **.gitignore patterns:** Need `directory/*` pattern to ignore contents but allow .gitkeep files
2. **Caddy domain substitution:** Automated in prod-up.sh for easier deployment
3. **Systemd integration:** Required for production reliability and auto-start
4. **Elder-friendly design:** Focus on simplicity, large text, home screen shortcuts

---

## Future Enhancements (Optional)

- [ ] Automated media backup script
- [ ] Health check monitoring
- [ ] Automated library scanning
- [ ] User activity logging
- [ ] Mobile app configuration guide
- [ ] Advanced Caddy features (rate limiting, etc.)

---

## Contact & Resources

- **Repository:** https://github.com/EVO-2022/audiobook
- **Audiobookshelf Docs:** https://www.audiobookshelf.org/docs
- **Caddy Docs:** https://caddyserver.com/docs
- **Cloudflare Tunnel Docs:** https://developers.cloudflare.com/cloudflare-one/

---

**Last Updated:** December 12, 2025  
**Status:** Ready for production deployment  
**Next Action:** Deploy to Ubuntu server and configure DNS

