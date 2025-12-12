# DNS Setup Instructions for rhonda.onl

## Step 1: Add Domain to Cloudflare

1. **Log into Cloudflare**: https://dash.cloudflare.com
2. **Click "Add a Site"** (or "+ Add Site" button)
3. **Enter your domain**: `rhonda.onl`
4. **Select Plan**: Choose "Free" plan
5. **Click "Continue"**

Cloudflare will scan your existing DNS records from Porkbun.

## Step 2: Review DNS Records

Cloudflare will show you the DNS records it found. Review them and make sure everything looks correct. Click **"Continue"** when ready.

## Step 3: Update Nameservers at Porkbun

Cloudflare will provide you with **two nameservers**. They'll look something like:
- `alice.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

Now update your nameservers at Porkbun:

1. **Log into Porkbun**: https://porkbun.com/account/domainsSpeedy
2. **Find rhonda.onl** in your domain list
3. **Click "Details"** or manage domain
4. **Find "Nameservers"** section
5. **Change from Porkbun nameservers to Cloudflare nameservers**:
   - Remove existing nameservers
   - Add the two Cloudflare nameservers
6. **Save changes**

## Step 4: Wait for DNS Propagation

- **Porkbun** usually updates nameservers within **15-30 minutes**
- **Cloudflare** will send you an email when the domain is active
- You can check status in Cloudflare dashboard

## Step 5: Configure Tunnel DNS Routes

Once the domain is active in Cloudflare, run these commands on your server:

```bash
cd /home/evo/audiobook

# Remove the incorrect DNS routes (if any exist)
cloudflared tunnel route dns delete rhonda.onl || true
cloudflared tunnel route dns delete www.rhonda.onl || true

# Add correct DNS routes for the audiobook tunnel
cloudflared tunnel route dns audiobook rhonda.onl
cloudflared tunnel route dns audiobook www.rhonda.onl
```

## Step 6: Verify Setup

After DNS propagates (15-30 minutes after nameserver change):

1. **Check DNS**:
   ```bash
   nslookup rhonda.onl
   ```
   Should show Cloudflare IPs

2. **Check tunnel status**:
   ```bash
   sudo systemctl status cloudflared-audiobook.service
   ```

3. **Test access**:
   - Open browser to: **https://rhonda.onl**
   - Should see Audiobookshelf login page

## Troubleshooting

### DNS not resolving
- Wait longer (up to 24-48 hours in rare cases)
- Check nameservers are updated at Porkbun
- Verify domain is "Active" in Cloudflare dashboard

### Tunnel not connecting
```bash
# Check tunnel logs
sudo journalctl -u cloudflared-audiobook.service -f

# Restart tunnel
sudo systemctl restart cloudflared-audiobook.service
```

### Can't access site
1. Verify containers are running:
   ```bash
   docker ps
   ```

2. Check audiobook service:
   ```bash
   sudo systemctl status audiobook.service
   ```

3. Test locally:
   ```bash
   curl http://localhost:80
   ```

## Current Tunnel Configuration

- **Tunnel Name**: audiobook
- **Tunnel ID**: 614b925d-ca52-43ed-8699-8ff2404c8839
- **Config File**: `/home/evo/.cloudflared/audiobook-config.yml`
- **Domains**: rhonda.onl, www.rhonda.onl
- **Service**: http://localhost:80 (Caddy → Audiobookshelf)

## Quick Reference Commands

```bash
# Check all services
sudo systemctl status audiobook.service
sudo systemctl status cloudflared-audiobook.service

# View logs
sudo journalctl -u audiobook.service -f
sudo journalctl -u cloudflared-audiobook.service -f
docker logs audiobookshelf-prod -f

# Restart services
sudo systemctl restart audiobook.service
sudo systemctl restart cloudflared-audiobook.service

# Stop services
sudo systemctl stop cloudflared-audiobook.service
sudo systemctl stop audiobook.service
```
