#!/bin/bash
set -e

# Link to storage
php artisan storage:link

# Run apache
exec apache2-foreground
