FROM php:8.2-apache

# Inštalácia závislostí potrebných pre Laravel
RUN apt-get update && apt-get install -y \
    git unzip zip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl \
    && a2enmod rewrite

# Nastav pracovný adresár
WORKDIR /var/www/html

# Skopíruj composer (pre inštaláciu závislostí)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Skopíruj zdrojové kódy
COPY . .

# Nainštaluj PHP závislosti cez composer
RUN composer install --no-dev --optimize-autoloader

# Nastav vlastníctvo a práva na storage a cache priečinky
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Skopíruj a sprístupni entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Apache konfigurácia pre Laravel (nastaví root do public)
RUN echo "<Directory /var/www/html/public>\n\
    Options +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/laravel.conf \
&& a2enconf laravel

# Nastav expose port 80
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
