#!/bin/bash
set -e

echo "[entrypoint] Spúšťam entrypoint..."

# ✅ Uisti sa, že priečinok existuje (Docker volume ho môže mountnúť prázdny)
mkdir -p /var/www/html/storage/app/public

# ✅ Odstráni existujúci symlink
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

# ✅ Laravel môže ešte vyžadovať:
# php artisan storage:link   # nepotrebuješ ak už máš vlastný symlink vyššie

# ✅ Štartuj server
echo "[entrypoint] Štartujem Apache..."
exec "$@"
