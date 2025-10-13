#!/bin/bash
set -e

# Symlink z /app/storage do ./storage (v pracovnom adresári)
if [ ! -L storage ]; then
  ln -s /app/storage storage
fi

# Symlink z public/storage do ../storage/app/public
if [ -L public/storage ]; then
  rm public/storage
fi
ln -s ../storage/app/public public/storage

# Nastavenie vlastníka a práv na storage
chown -R www-data:www-data storage
chmod -R 775 storage

# Spustenie pôvodného príkazu (napr. php-fpm alebo iný entrypoint)
exec "$@"
