# FROM php:8.2-cli

# RUN apt-get update && apt-get install -y git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev

# RUN docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

# WORKDIR /app

# COPY . .

# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# RUN composer install --no-dev --optimize-autoloader

# COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
# RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# EXPOSE 3000

# ENTRYPOINT ["docker-entrypoint.sh"]
# CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=3000"]
# CMD ["php", "artisan", "reverb:start", "--host=0.0.0.0", "--port=8080"]

FROM php:8.2-cli

RUN apt-get update && apt-get install -y git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev

RUN docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

WORKDIR /app

COPY . .

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "reverb:start", "--host=0.0.0.0", "--port=8080"]
