#!/bin/bash
set -e

echo "[entrypoint] Čakám na storage volume..."
until [ -d /var/www/html/storage/app/public ]; do
    sleep 1
done

echo "[entrypoint] Vytváram symlink public/storage..."
php artisan storage:link

echo "[entrypoint] Nastavujem práva na storage..."
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage
find /var/www/html/storage -type f -exec chmod 664 {} \;
find /var/www/html/storage -type d -exec chmod 775 {} \;

echo "[entrypoint] Spúšťam Laravel server..."
exec "$@"
