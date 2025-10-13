#!/bin/bash
set -e

# Remove old symlink if it exists
rm -rf public/storage

# Create a new symlink to the volume mount point
ln -s /app/storage/app/public public/storage

# Set permissions (recommended)
chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage

# Start Apache in the foreground
exec apache2-foreground
