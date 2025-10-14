<?php

use Dotenv\Dotenv;

$basePath = dirname(__DIR__);

$envFile = file_exists($basePath.'/.env.local') ? '.env.local' : '.env';

Dotenv::createImmutable($basePath, $envFile)->safeLoad();
