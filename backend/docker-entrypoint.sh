#!/bin/bash
set -e

echo "[entrypoint] Spúšťam entrypoint..."

# ✅ Odstráni starý symlink (ak existuje)
if [ -L /var/www/html/public/storage ]; then
    echo "[entrypoint] Odstraňujem existujúci symlink public/storage"
    rm /var/www/html/public/storage
fi

# ✅ Vytvorí nový symlink
if [ ! -e /var/www/html/public/storage ]; then
    echo "[entrypoint] Vytváram nový symlink public/storage → ../storage/app/public"
    ln -s ../storage/app/public /var/www/html/public/storage
fi

# ✅ Nastaví práva na storage (volume)
echo "[entrypoint] Nastavujem práva na storage/"
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage
find /var/www/html/storage -type f -exec chmod 664 {} \;
find /var/www/html/storage -type d -exec chmod 775 {} \;

# ✅ Spusti Apache
echo "[entrypoint] Štartujem Apache..."
exec "$@"
