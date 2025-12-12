#!/bin/bash
# Backup Audiobookshelf config and metadata (excludes large media files)

set -e

cd "$(dirname "$0")/.."

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/audiobookshelf_backup_$TIMESTAMP.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Creating backup..."
echo "This will backup config and metadata (NOT media files)"

# Create backup archive
tar -czf "$BACKUP_FILE" \
    --exclude='*.log' \
    --exclude='*.tmp' \
    ./data/config \
    ./data/metadata

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup created successfully: $BACKUP_FILE"
    echo "Size: $BACKUP_SIZE"
    echo ""
    echo "To restore, extract this archive to the project root."
else
    echo "ERROR: Backup failed!"
    exit 1
fi

