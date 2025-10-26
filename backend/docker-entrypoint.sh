#!/bin/bash
set -e

echo "[entrypoint] Čakám na mount volume..."
until [ -d /app/storage/app/public ]; do
    echo "Čakám na /app/storage/app/public..."
    sleep 1
done

echo "[entrypoint] Vytváram storage link (ak neexistuje)..."
php artisan storage:link --relative || true

chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage

echo "[entrypoint] Spúšťam Laravel server..."
exec php artisan serve --host=0.0.0.0 --port=3000
