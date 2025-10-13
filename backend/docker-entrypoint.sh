#!/bin/bash
set -e

# Odstráni staré symlinky (ak sú)
rm -f /var/www/html/storage
rm -f /var/www/html/public/storage

# Vytvor správny symlink public/storage -> ../storage/app/public
ln -s ../storage/app/public /var/www/html/public/storage

# Nastav vlastníctvo a práva na storage adresár (volume)
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage
find /var/www/html/storage -type f -exec chmod 664 {} \;
find /var/www/html/storage -type d -exec chmod 775 {} \;

# Spusti predaný príkaz (napr. apache2-foreground)
exec "$@"
