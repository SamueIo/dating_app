#!/bin/bash
set -e

echo "[entrypoint] Čakám na storage volume..."
until [ -d /app/storage/app/public ]; do
    sleep 1
done

echo "[entrypoint] Vytváram symlink public/storage..."
php artisan storage:link

echo "[entrypoint] Nastavujem práva na storage..."
chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage
find /app/storage -type f -exec chmod 664 {} \;
find /app/storage -type d -exec chmod 775 {} \;

echo "[entrypoint] Spúšťam Laravel server..."
exec "$@"
