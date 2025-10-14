#!/bin/bash
set -e

echo "[entrypoint] Spúšťam entrypoint..."

# Uisti sa, že priečinok storage/app/public existuje
mkdir -p /var/www/html/storage/app/public

# Over, či je volume pripojené na /var/www/html/storage
if mountpoint -q /var/www/html/storage; then
    echo "[entrypoint] Volume je pripojené."

    # Odstráni existujúci symlink, ak existuje
    if [ -L /var/www/html/public/storage ]; then
        echo "[entrypoint] Odstraňujem existujúci symlink public/storage"
        rm /var/www/html/public/storage
    fi

    # Vytvor nový symlink s absolútnou cestou
    if [ ! -e /var/www/html/public/storage ]; then
        echo "[entrypoint] Vytváram nový symlink public/storage → /var/www/html/storage/app/public"
        ln -s /var/www/html/storage/app/public /var/www/html/public/storage
    fi
else
    echo "[entrypoint] Volume nie je pripojené, symlink nevytváram."
fi

# Nastav práva na storage
echo "[entrypoint] Nastavujem práva na storage/"
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage
find /var/www/html/storage -type f -exec chmod 664 {} \;
find /var/www/html/storage -type d -exec chmod 775 {} \;

# Laravel storage link (ak by bolo potrebné)
php artisan storage:link || true

# Spusti Apache (alebo iný server)
echo "[entrypoint] Štartujem Apache..."
exec "$@"
