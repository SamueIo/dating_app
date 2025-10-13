#!/bin/bash
set -e

# Remove existing symlinks if any
rm -f storage
rm -f public/storage

# Create symlinks
ln -s /app/storage storage
ln -s ../storage/app/public public/storage

# Set permissions
chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage

exec "$@"
