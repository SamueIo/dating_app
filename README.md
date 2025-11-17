# MatchLove

A dating application built with **Laravel** (backend) and **Vue.js** (frontend), fully containerized with **Docker**.  
It allows users to connect, chat, and interact in real-time.

---

## Table of Contents

1. [Description](#description)
2. [Tech Stack](#tech-stack)
3. [Setup / Installation](#setup--installation)
4. [Usage](#usage)
5. [Environment Variables](#environment-variables)


---

## Description

MatchLove is a dating platform designed to help users find and connect with potential matches.  
The platform offers features including user authentication, profile management, messaging, and real-time interactions, powered by a Laravel backend and a Vue.js frontend.

Users can swipe through potential matches, explore profiles with customizable filters, and personalize their own profiles. Messaging is enhanced with interactive chat bubbles, creating a dynamic environment for connections.

---

## Tech Stack

- **Backend:** Laravel 12, PHP 8+
- **Frontend:** Vue.js 3, Vite
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Notifications:** Vue Toastification
- **Authentication & Security:** Laravel Sanctum
- **Database:** MySQL
- **Containerization:** Docker, Docker Compose
- **Realtime Communication:** Reverb (Laravel-based WebSocket server)

---

## Setup / Installation

Uncomment everything in docker-compose.yml
### Backend

```bash
cd backend
cp .env.example .env
docker compose run --rm --entrypoint bash backend
composer install
php artisan key:generate
exit
```

### Frontend Setup

1. Navigate to the frontend folder and rename the Docker example file:

```bash
cd frontend
mv docker.example docker
```

2. Update ports in .env if needed:

VITE_REVERB_PORT=8081
VITE_REVERB_WS_PORT=8081

3. Build the frontend image

```bash
docker compose build frontend
```


Start All Services

```bash
docker compose up
```

Access the frontend in your browser:
http://localhost:5173


### Usage

<!-- markdown -->
## Usage

Once all services are running, you can use the application as follows:

- Run database migrations:

```bash
docker compose exec backend php artisan migrate
```

# Start reverb

```bash
docker exec -it dating_app-backend-1 sh
nohup php artisan reverb:start --host=0.0.0.0 --port=3001 > reverb.log 2>&1 &
```

Access the phpMyAdmin in your browser:
http://localhost:8080


### Environment Variables

<!-- markdown -->
## Environment Variables

# Backend (.env)
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=backend
DB_USERNAME=user
DB_PASSWORD=password

# Frontend (.env)
VITE_REVERB_PORT=8081
VITE_REVERB_WS_PORT=8081


