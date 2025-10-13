#!/bin/bash
set -e

# ✅ Vytvor symlink iba ak ešte neexistuje
if [ ! -L /var/www/html/public/storage ]; then
    echo "🔗 Creating symlink: public/storage → ../storage/app/public"
    ln -s ../storage/app/public /var/www/html/public/storage
fi

# ✅ Nastav práva (opatrne – môžeš obmedziť na app/public ak chceš)
echo "🔧 Setting permissions..."
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage
find /var/www/html/storage -type f -exec chmod 664 {} \;
find /var/www/html/storage -type d -exec chmod 775 {} \;

# ✅ Spusti Apache alebo iný CMD príkaz
exec "$@"
