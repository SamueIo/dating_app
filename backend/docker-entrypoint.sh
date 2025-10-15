#!/bin/bash
set -e

until [ -d /app/storage/app/public ]; do
    sleep 1
done

php artisan storage:link

chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage
find /app/storage -type f -exec chmod 664 {} \;
find /app/storage -type d -exec chmod 775 {} \;


echo "[entrypoint] Spúšťam Laravel server..."
exec "$@"
