# Východiskový obraz pre PHP 8.2 s CLI
FROM php:8.2-cli

# Inštalácia potrebných balíčkov pre obrázky a GD knižnicu s podporou pre WebP
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    procps \
    libwebp-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl gd \
    && apt-get clean

# Nastavenie pracovného adresára v kontejnery
WORKDIR /app

# Kopírovanie aplikácie do kontajnera
COPY . .

# Inštalácia Composeru z oficiálneho obrazu
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Kopírovanie a nastavenie práv pre docker-entrypoint skript
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exponovanie portu 3000 pre prístup k aplikácii
EXPOSE 3000

# Spustenie docker-entrypoint skriptu
ENTRYPOINT ["docker-entrypoint.sh"]
