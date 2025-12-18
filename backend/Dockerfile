FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache mod_rewrite
# Handle Apache MPM conflicts (Ensure only prefork is used for mod_php)
RUN rm -f /etc/apache2/mods-enabled/mpm_*.load && a2enmod mpm_prefork rewrite

# Set working directory
WORKDIR /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code
COPY . .

# Handle Monorepo Build Context (Railway fix)
# If "backend" folder exists, we are in Root Context -> Move files up
RUN if [ -d "backend" ]; then cp -rp backend/. . && rm -rf backend frontend; fi

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache DocumentRoot to public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf | sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

EXPOSE 8080
# Railway often expects port 8080 or uses PORT env var (Apache defaults to 80, we need to bind to PORT if provided, but typically 80 is fine for internal container, Railway handles mapping. However, making it flexible is good practice). 
# For simplicity in this Apache image, we'll stick to default 80 but ensure sed command updates it if needed, or just expose 80.
# Actually, Railway sets $PORT. Apache listens on 80 by default. Let's configure Apache to listen on $PORT or 80.
RUN sed -i 's/80/${PORT:-80}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Start Apache
CMD ["apache2-foreground"]
