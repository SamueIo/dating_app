#!/bin/bash
set -e

php artisan storage:link


chown -R www-data:www-data /app/storage
chmod -R 775 /app/storage

echo "[entrypoint] Spúšťam Laravel server..."
exec php artisan serve --host=0.0.0.0 --port=3000
