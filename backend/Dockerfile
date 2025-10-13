FROM php:8.2-apache

# System dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Apache config - povolenie prístupu k /var/www/html/public a follow symlinks
RUN echo "<Directory /var/www/html/public>\n\
    Options +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n\
<Directory /var/www/html/public/storage>\n\
    Options +FollowSymLinks\n\
    AllowOverride None\n\
    Require all granted\n\
</Directory>" > /etc/apache2/conf-available/public.conf && a2enconf public

# Nastav DocumentRoot na public/
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Aktualizuj default site config na nový DocumentRoot
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY . .

# Composer (stiahni a nainštaluj závislosti)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Nastav práva na storage a bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Kopíruj entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
