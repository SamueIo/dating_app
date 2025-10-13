#!/bin/bash
set -e

# Odstráni existujúce symlinky, ak sú
rm -f /var/www/html/storage
rm -f /var/www/html/public/storage

# Vytvor symlink 'storage' na /app/storage
ln -s /app/storage /var/www/html/storage

# Vytvor symlink public/storage -> ../storage/app/public
ln -s ../storage/app/public /var/www/html/public/storage

# Nastav vlastníctvo a práva
chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage
find /app/storage -type f -exec chmod 664 {} \;
find /app/storage -type d -exec chmod 775 {} \;

# Spustí príkaz, ktorý bol odovzdaný kontajneru (napr. apache2-foreground)
exec "$@"
