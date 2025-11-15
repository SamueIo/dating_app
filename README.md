Dating App

<!-- Backend -->

A dating application built with Laravel API and Vue.js. The app provides a swipe-based interface and real-time messaging.

Features

Explore Accounts: Browse other user profiles with filters.

Swipe Interface: Like or pass on profiles in a familiar swipe-style UI.

Real-Time Messaging: Chat instantly with your matches.

Matches: See mutual likes and connect with compatible users.

Settings: Update your profile, see blocked users.

Tech Stack

Backend: Laravel (REST API), Authentication with Sanctum

Frontend: Vue.js

Database: MySQL

Real-Time: Pusher / Laravel Reverb (for real-time messaging)

Installation
Requirements

PHP 8.2 (CLI)

Composer

Required PHP extensions:

pdo, pdo_mysql

mbstring

zip

exif

pcntl

gd (with FreeType, JPEG, WebP support)

System packages (for GD and general functionality):

git, curl, zip, unzip

libpng-dev, libjpeg-dev, libfreetype6-dev, libwebp-dev

libonig-dev, libxml2-dev, libzip-dev

procps

Clone and Build
git clone https://github.com/SamueIo/dating_app.git
cd dating-app
docker build -t dating_app2 ./backend
docker run -p 3000:3000 dating-app-backend

Inside the container

Install PHP dependencies via Composer:

composer install --no-dev --optimize-autoloader


Set up environment and database:

cp .env.example .env
php artisan key:generate
php artisan migrate

PHP Configuration (Optional)

The Dockerfile sets the following recommended PHP limits:

upload_max_filesize = 10M

post_max_size = 60M

max_file_uploads = 20

max_execution_time = 300

max_input_time = 300

<!-- Frontend -->
Frontend Setup

The frontend is built with Vue.js, styled using TailwindCSS, and uses Toastificator for notifications.

Requirements

Node.js (v16+ recommended)

npm or yarn

Installation

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


Open the app in your browser:

http://localhost:5173