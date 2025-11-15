Dating App
A full-stack dating application built with Laravel API and Vue.js, featuring swipe-based profile browsing, real-time messaging, matching, and user profile management.

Features


Explore Accounts – Browse user profiles with filters


Swipe Interface – Like or pass using a swipe-style UI


Real-Time Messaging – Instant chat using Pusher / Laravel Reverb


Matches – See mutual likes and connect with compatible users


Settings – Update your profile, manage blocked users



Tech Stack
Backend


Laravel (REST API)


Sanctum authentication


MySQL


Laravel Reverb / Pusher


Frontend


Vue.js


TailwindCSS


Toastificator



Backend Setup (Docker)
The backend runs entirely inside Docker using PHP 8.2 CLI with GD (WebP support) and a custom docker-entrypoint.sh script.

Clone Repository
git clone https://github.com/SamueIo/dating_app.git
cd dating_app/backend


Build Docker Image
docker build -t dating_app_backend .


Environment Setup
cp .env.example .env

Edit .env and configure your database connection.

Run Backend Container
docker run -p 3000:3000 --env-file .env dating_app_backend

Backend will be available at:
http://localhost:3000

What docker-entrypoint.sh Does


Installs Composer dependencies if missing


Generates APP_KEY if missing


Runs database migrations


Starts the Laravel server on port 3000



PHP Configuration (inside Dockerfile)
upload_max_filesize = 10M
post_max_size = 60M
max_file_uploads = 20
max_execution_time = 300
max_input_time = 300


Frontend Setup (Vue.js)
Navigate to Frontend
cd ../frontend

Install Dependencies
npm install

Start Development Server
npm run dev

Frontend runs at:
http://localhost:5173

Done


Backend runs in Docker


Frontend runs with Vite


Full stack ready for development or deployment


