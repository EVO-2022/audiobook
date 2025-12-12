# Self-Hosted Audiobookshelf - Elder-Friendly Setup

A complete self-hosted Audiobookshelf system designed for easy administration and elder-friendly mobile access. No subscriptions, no Audible, no Echo—just your audiobooks, managed by you.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Initial Setup](#initial-setup)
- [User Management](#user-management)
- [Adding Audiobooks](#adding-audiobooks)
- [Mobile Access (Elder-Friendly)](#mobile-access-elder-friendly)
- [Production Deployment](#production-deployment)
- [Backup & Maintenance](#backup--maintenance)
- [Troubleshooting](#troubleshooting)

## Features

- ✅ Self-hosted, no subscriptions required
- ✅ Docker-based for easy deployment
- ✅ HTTPS support via Caddy with automatic Let's Encrypt
- ✅ Cloudflare Tunnel option (no open ports)
- ✅ Simple backup scripts
- ✅ Elder-friendly mobile access
- ✅ Admin-managed library, user-friendly listening

## Quick Start (Local Development)

### Prerequisites

- macOS with Docker Desktop installed
- Git

### Step 1: Clone and Setup

```bash
git clone <your-repo-url>
cd audiobook
```

### Step 2: Create Environment File

Create a `.env` file (copy from `.env.example` if needed):

```bash
# .env
TZ=America/Chicago
ABS_PORT=13378
```

### Step 3: Start Audiobookshelf

```bash
./scripts/dev-up.sh
```

Audiobookshelf will be available at: **http://localhost:13378**

### Step 4: Stop Audiobookshelf

```bash
./scripts/dev-down.sh
```

### View Logs

```bash
./scripts/logs.sh
```

## Initial Setup

### 1. Create Admin Account

1. Open http://localhost:13378 in your browser
2. You'll see the initial setup screen
3. Create your admin account:
   - Username: (choose your admin username)
   - Email: (your email)
   - Password: (strong password)
4. Click "Create Account"

### 2. Configure Initial Settings

After logging in as admin:

1. **Settings → Server Settings**
   - Review and adjust as needed
   - Note the "Server URL" if you'll be accessing remotely

2. **Settings → Libraries**
   - We'll create libraries next

## User Management

### Create Mom's User Account

1. Log in as admin
2. Go to **Settings → Users**
3. Click **"New User"** or **"Add User"**
4. Fill in:
   - **Username**: `mom` (or preferred name)
   - **Email**: (mom's email, optional)
   - **Password**: (simple, easy-to-remember password)
   - **Role**: **User** (NOT Admin)
   - **Libraries**: Select which libraries mom can access (we'll create these next)
5. Click **"Save"** or **"Create User"**

### Create Libraries

1. Go to **Settings → Libraries**
2. Click **"New Library"** or **"Add Library"**

#### Audiobooks Library

- **Name**: `Audiobooks`
- **Type**: `Audiobooks`
- **Folder Path**: `/audiobooks` (this maps to `./media/audiobooks` on your host)
- **Description**: (optional)
- Click **"Save"**

#### Podcasts Library (Optional)

- **Name**: `Podcasts`
- **Type**: `Podcasts`
- **Folder Path**: `/podcasts` (this maps to `./media/podcasts` on your host)
- Click **"Save"**

### Assign Libraries to Mom's Account

1. Go to **Settings → Users**
2. Click on **Mom's user account**
3. Under **"Libraries"** or **"Access"**, select:
   - ✅ Audiobooks
   - ✅ Podcasts (if created)
4. **Uncheck** any admin-only libraries if they exist
5. Click **"Save"**

## Adding Audiobooks

### Method 1: Direct File Copy (Recommended)

1. **Stop the container** (optional, but recommended for large transfers):
   ```bash
   ./scripts/dev-down.sh
   ```

2. **Copy audiobook files** to the media directory:
   ```bash
   # Example: Copy a folder of audiobooks
   cp -r /path/to/your/audiobooks/* ./media/audiobooks/
   
   # Or use Finder/Drag-and-drop to ./media/audiobooks/
   ```

3. **Organize files** (Audiobookshelf prefers this structure):
   ```
   ./media/audiobooks/
   ├── Author Name/
   │   ├── Book Title/
   │   │   ├── 01 - Chapter 1.mp3
   │   │   ├── 02 - Chapter 2.mp3
   │   │   └── cover.jpg (optional)
   │   └── Another Book/
   │       └── ...
   └── Another Author/
       └── ...
   ```

4. **Start the container**:
   ```bash
   ./scripts/dev-up.sh
   ```

5. **Rescan library**:
   - Log in as admin
   - Go to **Settings → Libraries**
   - Click on **"Audiobooks"** library
   - Click **"Rescan"** or **"Scan Library"**
   - Wait for the scan to complete (check progress in the UI)

### Method 2: Upload via Web UI

1. Log in as admin
2. Go to **Settings → Libraries**
3. Click on **"Audiobooks"** library
4. Look for **"Upload"** or **"Add Files"** option (if available in your ABS version)
5. Upload audiobook files/folders
6. The library will auto-scan or you can manually rescan

### Supported Formats

Audiobookshelf supports:
- MP3, M4B, M4A, FLAC, OGG, OPUS, WAV
- Most common audiobook formats

## Mobile Access (Elder-Friendly)

### Option 1: iOS App (Recommended)

1. **Download Audiobookshelf app** from the App Store
2. **Open the app**
3. **Add Server**:
   - Server URL: `https://mom.example.com` (or your production URL)
   - Username: `mom` (or mom's username)
   - Password: (mom's password)
4. **Save** and log in

#### Elder-Friendly App Settings

Inside the Audiobookshelf iOS app:
- **Playback Speed**: Adjust in player (usually 0.5x to 2.0x)
- **Sleep Timer**: Available in player controls
- **Large Text**: iOS Settings → Display & Brightness → Text Size (increase system-wide)
- **Accessibility**: iOS Settings → Accessibility → Display & Text Size → Larger Text

### Option 2: Mobile Web Player

1. **Open Safari** on iPhone
2. **Navigate to**: `https://mom.example.com` (or your production URL)
3. **Log in** with mom's credentials
4. **Add to Home Screen**:
   - Tap the **Share** button (square with arrow)
   - Select **"Add to Home Screen"**
   - Name it: **"Audiobooks"** (or similar)
   - Tap **"Add"**
5. Now mom can tap the home screen icon to access audiobooks

#### Elder-Friendly Web Settings

**iOS Safari Settings:**
1. **Settings → Safari → Page Zoom**: Set to 150% or higher
2. **Settings → Display & Brightness → Text Size**: Increase
3. **Settings → Accessibility → Display & Text Size → Larger Text**: Enable and increase

**Audiobookshelf Web Player:**
- Use the **player controls** at the bottom
- **Play/Pause**: Large button in center
- **Skip Forward/Back**: 30-second buttons (usually)
- **Playback Speed**: Adjust in player settings
- **Sleep Timer**: Available in player menu

### Elder-Friendly Configuration Checklist

**For Mom's Account:**
- ✅ Non-admin user (no access to settings)
- ✅ Access only to "Audiobooks" library (and optionally "Podcasts")
- ✅ Simple password (or use password manager)
- ✅ Home screen shortcut created on iPhone

**iOS Device Settings:**
- ✅ Text size increased (Settings → Display & Brightness → Text Size)
- ✅ Safari zoom increased (Settings → Safari → Page Zoom)
- ✅ Larger text enabled (Settings → Accessibility → Display & Text Size)
- ✅ Home screen shortcut to Audiobookshelf URL

**Audiobookshelf Settings (as Admin):**
- Check **Settings → Server Settings** for any UI simplification options
- Review **Settings → Users → Mom** to ensure minimal permissions
- Consider disabling any unnecessary features in server settings if available

## Production Deployment

### Prerequisites

- Ubuntu server (20.04 or later recommended)
- Docker and Docker Compose installed
- Domain name (for public domain mode) OR Cloudflare account (for tunnel mode)
- Ports 80 and 443 open (for public domain mode) OR Cloudflare Tunnel installed (for tunnel mode)

### Install Docker on Ubuntu

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

### Deploy to Server

1. **Clone repository on server**:
   ```bash
   git clone <your-repo-url>
   cd audiobook
   ```

2. **Create `.env` file**:
   ```bash
   nano .env
   ```
   
   Fill in:
   ```bash
   TZ=America/Chicago
   DOMAIN=mom.example.com
   EMAIL=your-email@example.com
   ABS_PORT=13378
   ```

3. **Update Caddyfile** (if needed):
   ```bash
   nano Caddyfile
   ```
   
   Ensure it contains your domain:
   ```
   mom.example.com {
       reverse_proxy audiobookshelf:80
       ...
   }
   ```

4. **Start production environment**:
   ```bash
   ./scripts/prod-up.sh
   ```

5. **Check logs**:
   ```bash
   ./scripts/logs.sh
   ```

6. **Access**: https://mom.example.com

### Option A: Public Domain (Ports 80/443 Open)

**Requirements:**
- Domain name pointing to your server's IP
- Ports 80 and 443 open in firewall
- Email for Let's Encrypt notifications

**Setup:**

1. **Point domain to server**:
   - In your DNS provider, create an A record:
     - Name: `mom` (or `@` for root domain)
     - Value: Your server's public IP
     - TTL: 300 (or default)

2. **Configure firewall** (if using UFW):
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 443/udp
   sudo ufw enable
   ```

3. **Update `.env`**:
   ```bash
   DOMAIN=mom.example.com
   EMAIL=your-email@example.com
   ```

4. **Start services**:
   ```bash
   ./scripts/prod-up.sh
   ```

5. **Wait for SSL**: Caddy will automatically obtain SSL certificate. Check logs:
   ```bash
   ./scripts/logs.sh
   ```

6. **Access**: https://mom.example.com

### Option B: Cloudflare Tunnel (No Open Ports)

**Requirements:**
- Cloudflare account (free tier works)
- Domain managed by Cloudflare
- Cloudflare Tunnel installed on server

**Setup:**

1. **Install Cloudflare Tunnel**:
   ```bash
   # Download cloudflared
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
   chmod +x cloudflared-linux-amd64
   sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
   ```

2. **Authenticate**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create tunnel**:
   ```bash
   cloudflared tunnel create audiobookshelf
   ```

4. **Configure tunnel**:
   ```bash
   # Get tunnel ID
   cloudflared tunnel list
   
   # Create config file
   mkdir -p ~/.cloudflared
   nano ~/.cloudflared/config.yml
   ```
   
   Add:
   ```yaml
   tunnel: <your-tunnel-id>
   credentials-file: /home/your-user/.cloudflared/<tunnel-id>.json
   
   ingress:
     - hostname: mom.example.com
       service: http://localhost:80
     - service: http_status:404
   ```

5. **Create DNS record**:
   ```bash
   cloudflared tunnel route dns audiobookshelf mom.example.com
   ```

6. **Update Caddyfile** (use local version):
   ```bash
   cp Caddyfile.local Caddyfile
   # Or edit Caddyfile to use localhost instead of domain
   ```

7. **Update `.env`** (domain not needed for tunnel):
   ```bash
   DOMAIN=
   EMAIL=
   ```

8. **Start Audiobookshelf** (without Caddy, or with local Caddyfile):
   ```bash
   # Option 1: Use local Caddyfile (localhost only)
   ./scripts/prod-up.sh
   
   # Option 2: Run only Audiobookshelf (no Caddy)
   docker compose -f docker-compose.prod.yml up -d audiobookshelf
   ```

9. **Start Cloudflare Tunnel**:
   ```bash
   # Run as service (recommended)
   sudo cloudflared service install
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   
   # Or run manually
   cloudflared tunnel run audiobookshelf
   ```

10. **Access**: https://mom.example.com (via Cloudflare Tunnel)

**Note**: With Cloudflare Tunnel, you don't need Caddy for HTTPS (Cloudflare handles it). You can either:
- Run Audiobookshelf directly on port 80 and point tunnel to it
- Or keep Caddy for internal routing (tunnel → Caddy → Audiobookshelf)

## Backup & Maintenance

### Backup

Backup config and metadata (excludes large media files):

```bash
./scripts/backup.sh
```

Backups are saved to `./backups/audiobookshelf_backup_YYYYMMDD_HHMMSS.tar.gz`

**To restore:**
```bash
# Stop containers
./scripts/prod-down.sh  # or dev-down.sh

# Extract backup
tar -xzf backups/audiobookshelf_backup_YYYYMMDD_HHMMSS.tar.gz

# Start containers
./scripts/prod-up.sh  # or dev-up.sh
```

### Update Audiobookshelf

```bash
./scripts/update.sh
```

This pulls the latest images and restarts containers.

### Manual Media Backup

Media files are NOT included in automated backups (they're too large). To backup media:

```bash
# Backup audiobooks
tar -czf backups/audiobooks_backup_$(date +%Y%m%d).tar.gz ./media/audiobooks

# Backup podcasts
tar -czf backups/podcasts_backup_$(date +%Y%m%d).tar.gz ./media/podcasts
```

## Troubleshooting

### Container won't start

```bash
# Check logs
./scripts/logs.sh

# Check if port is in use
lsof -i :13378  # for dev
lsof -i :80    # for prod
lsof -i :443   # for prod

# Check Docker
docker ps -a
docker compose -f docker-compose.yml ps
```

### Can't access web interface

1. **Check container is running**:
   ```bash
   docker ps | grep audiobookshelf
   ```

2. **Check logs**:
   ```bash
   ./scripts/logs.sh
   ```

3. **Check firewall** (production):
   ```bash
   sudo ufw status
   ```

4. **Check DNS** (production):
   ```bash
   nslookup mom.example.com
   ```

### SSL certificate issues (Caddy)

1. **Check Caddy logs**:
   ```bash
   docker logs caddy-proxy
   ```

2. **Verify domain points to server**:
   ```bash
   dig mom.example.com
   ```

3. **Check ports 80/443 are open**:
   ```bash
   sudo netstat -tulpn | grep -E ':(80|443)'
   ```

4. **Manual certificate check**:
   - Visit https://www.ssllabs.com/ssltest/analyze.html?d=mom.example.com

### Library not scanning

1. **Check file permissions**:
   ```bash
   ls -la ./media/audiobooks
   # Ensure files are readable
   ```

2. **Check library path in ABS**:
   - Settings → Libraries → [Library Name]
   - Verify folder path is `/audiobooks` (for audiobooks) or `/podcasts` (for podcasts)

3. **Manual rescan**:
   - Settings → Libraries → [Library Name] → Rescan

4. **Check container logs**:
   ```bash
   ./scripts/logs.sh
   ```

### User can't log in

1. **Reset password** (as admin):
   - Settings → Users → [User] → Edit → Change Password

2. **Check user has library access**:
   - Settings → Users → [User] → Libraries (ensure libraries are selected)

### Performance issues

1. **Check disk space**:
   ```bash
   df -h
   ```

2. **Check container resources**:
   ```bash
   docker stats
   ```

3. **Check logs for errors**:
   ```bash
   ./scripts/logs.sh
   ```

## Repository Structure

```
audiobook/
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production with Caddy
├── Caddyfile                   # Caddy config (public domain)
├── Caddyfile.local             # Caddy config (local/internal)
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── scripts/
│   ├── dev-up.sh              # Start dev environment
│   ├── dev-down.sh            # Stop dev environment
│   ├── prod-up.sh             # Start production
│   ├── prod-down.sh           # Stop production
│   ├── logs.sh                # View logs
│   ├── update.sh              # Update images
│   └── backup.sh              # Backup config/metadata
├── data/
│   ├── config/                # ABS config (gitignored)
│   ├── metadata/              # ABS metadata (gitignored)
│   └── caddy/                 # Caddy data (gitignored)
├── media/
│   ├── audiobooks/            # Audiobook files (gitignored)
│   └── podcasts/              # Podcast files (gitignored)
└── README.md                  # This file
```

## Support & Resources

- **Audiobookshelf Documentation**: https://www.audiobookshelf.org/docs
- **Audiobookshelf GitHub**: https://github.com/advplyr/audiobookshelf
- **Caddy Documentation**: https://caddyserver.com/docs
- **Cloudflare Tunnel Docs**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

## License

This setup is for personal use. Audiobookshelf is licensed under GPL-3.0.

---

**Happy Listening! 📚🎧**

