#!/bin/bash
set -e

echo "[entrypoint] Čakám na mount volume..."
until [ -d /app/storage/app/public ]; do
    echo "Čakám na /app/storage/app/public..."
    sleep 1
done

echo "[entrypoint] Kontrolujem, či existuje storage link..."
if [ ! -L /app/public/storage ]; then
    echo "Vytváram storage link..."
    php artisan storage:link --relative
else
    echo "Storage link už existuje."
fi

php artisan reverb:start --host=0.0.0.0 --port=3000

chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage
find /app/storage -type f -exec chmod 664 {} \;
find /app/storage -type d -exec chmod 775 {} \;

echo "[entrypoint] Spúšťam Laravel server..."
exec "$@"
