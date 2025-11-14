# UM Events - Event Management System

A comprehensive event management system for the University of Mindanao, built with Laravel 12. This system allows students and administrators to manage venue bookings, events, and feedback through a modern web interface.

## 📋 Table of Contents

- [Features](#features)
- [System Components](#system-components)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Documentation](#documentation)

## ✨ Features

- **Google OAuth Authentication** - Secure login with @umindanao.edu.ph email restriction
- **Role-Based Access Control** - Separate dashboards and sidebars for Admin and Organizer roles
- **Venue Management** - Browse and manage university facilities
- **Booking System** - Request and manage event bookings
- **Feedback System** - Submit and review feedback
- **Responsive Design** - Modern UI with Tailwind CSS and scroll animations
- **Admin Dashboard** - Comprehensive admin panel for managing requests, venues, and users
- **Organizer Dashboard** - User-friendly dashboard for event organizers

## 🧩 System Components

### Laravel Framework Components

#### Core Framework
- **Laravel Framework 12.37.0** - Modern PHP web framework
  - Routing system
  - Eloquent ORM
  - Blade templating engine
  - Middleware system
  - Session management
  - Cache system

#### Authentication & Authorization
- **Laravel Socialite 5.23** - OAuth authentication provider
  - Google OAuth integration
  - Domain restriction (@umindanao.edu.ph)
  - Role-based access control (ADMIN/ORGANIZER)

#### Development Tools
- **Laravel Tinker 2.10** - Interactive REPL for Laravel
- **Laravel Pint 1.24** - Code formatter
- **Laravel Pail 1.2** - Log viewer
- **Laravel Sail 1.41** - Docker development environment

#### Testing Framework
- **Pest PHP 4.1** - Modern PHP testing framework
- **Pest Laravel Plugin 4.0** - Laravel integration for Pest
- **Mockery 1.6** - Mocking framework
- **Faker PHP 1.23** - Fake data generator

#### Error Handling
- **Collision 8.6** - Error handler for console applications

### Frontend Components

#### Build Tools
- **Vite 7.0** - Next-generation frontend build tool
- **Laravel Vite Plugin 2.0** - Laravel integration for Vite
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **@tailwindcss/vite 4.0** - Tailwind CSS Vite plugin
- **PostCSS 8.5** - CSS transformation tool
- **Autoprefixer 10.4** - CSS vendor prefixer

#### JavaScript Libraries
- **Axios 1.11** - HTTP client for API requests
- **Concurrently 9.0** - Run multiple commands concurrently

### Database Components

#### Migrations
- `create_users_table` - User authentication and profile data
- `create_cache_table` - Cache storage
- `create_jobs_table` - Queue job storage
- `add_google_id_to_users_table` - Google OAuth integration
- `add_role_department_avatar_to_users_table` - User roles and profile

#### Seeders
- `DatabaseSeeder` - Main database seeder
- `AdminUserSeeder` - Admin user setup seeder

### Custom Components

#### Controllers
- `GoogleController` - Google OAuth authentication handler
- `DashboardController` - Role-based dashboard controller
- `VenueController` - Venue management
- `BookingController` - Booking management
- `FeedbackController` - Feedback management
- `ProfileController` - User profile management

#### Models
- `User` - User model with OAuth and role support

#### Views
- **Layouts**: `app.blade.php`, `hero.blade.php`
- **Components**: `sidebar-admin.blade.php`, `sidebar-organizer.blade.php`, `header.blade.php`, `user_profile_banner.blade.php`
- **Pages**: `home.blade.php`, `dashboard-admin.blade.php`, `dashboard-organizer.blade.php`, `login.blade.php`

#### Configuration Files
- `config/admin_emails.php` - Admin email configuration
- `config/services.php` - Third-party service configurations (Google OAuth)

## 📦 Prerequisites

Before installing, ensure you have the following installed on your system:

- **PHP 8.2 or higher** with extensions:
  - BCMath
  - Ctype
  - cURL
  - DOM
  - Fileinfo
  - JSON
  - Mbstring
  - OpenSSL
  - PCRE
  - PDO
  - Tokenizer
  - XML
- **Composer** - PHP dependency manager
- **Node.js 18+** and **npm** - JavaScript package manager
- **MySQL/MariaDB** or **PostgreSQL** - Database server
- **Git** - Version control

### Optional but Recommended
- **Google Cloud Console Account** - For OAuth setup
- **Laravel Sail** - For Docker-based development

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ems_dev
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This will install all Laravel packages including:
- Laravel Framework
- Laravel Socialite
- Laravel Tinker
- Testing frameworks (Pest, Mockery)
- Development tools (Pint, Pail, Sail)

### Step 3: Install Node Dependencies

```bash
npm install
```

This will install:
- Vite and build tools
- Tailwind CSS
- Axios
- Other frontend dependencies

### Step 4: Environment Configuration

Copy the environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### Step 5: Configure Database

Edit `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ems_dev
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Step 6: Run Migrations

```bash
php artisan migrate
```

This will create all necessary database tables:
- `users` - User accounts with OAuth support
- `cache` - Cache storage
- `jobs` - Queue jobs
- `sessions` - Session storage

### Step 7: Seed Admin Users (Optional)

```bash
php artisan db:seed --class=AdminUserSeeder
```

This sets up admin users based on `config/admin_emails.php`.

### Step 8: Build Frontend Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### Step 9: Start Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## ⚙️ Configuration

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API

2. **Create OAuth 2.0 Credentials**
   - Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8000/auth/google/callback` (or your domain)

3. **Configure Environment Variables**

   Edit `.env` file:

   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   APP_URL=http://localhost:8000
   ```

4. **Configure Admin Emails**

   Edit `config/admin_emails.php`:

   ```php
   'admin_emails' => [
       'egaran.548856@umindanao.edu.ph',
       // Add more admin emails here
   ],
   ```

### Session Configuration

Edit `.env`:

```env
SESSION_DRIVER=database
SESSION_LIFETIME=120
```

### Mail Configuration (Optional)

If you need email functionality, configure mail settings in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@umindanao.edu.ph"
MAIL_FROM_NAME="${APP_NAME}"
```

## 📁 Project Structure

```
ems_dev/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Auth/
│   │       │   └── GoogleController.php      # Google OAuth handler
│   │       ├── DashboardController.php       # Role-based dashboard
│   │       ├── VenueController.php          # Venue management
│   │       ├── BookingController.php        # Booking management
│   │       ├── FeedbackController.php       # Feedback management
│   │       └── ProfileController.php        # User profile
│   ├── Models/
│   │   └── User.php                         # User model with roles
│   └── Providers/
│       └── AppServiceProvider.php           # Service provider
├── bootstrap/
│   ├── app.php                             # Application bootstrap
│   └── providers.php                      # Service providers
├── config/
│   ├── admin_emails.php                   # Admin email configuration
│   ├── services.php                       # Third-party services
│   ├── auth.php                           # Authentication config
│   └── database.php                       # Database config
├── database/
│   ├── migrations/                        # Database migrations
│   ├── seeders/                           # Database seeders
│   └── factories/                         # Model factories
├── public/
│   ├── index.php                          # Entry point
│   └── build/                             # Compiled assets
├── resources/
│   ├── css/
│   │   └── app.css                        # Main stylesheet
│   ├── js/
│   │   ├── app.js                         # Main JavaScript
│   │   └── bootstrap.js                   # Bootstrap file
│   └── views/
│       ├── layouts/                       # Layout templates
│       ├── components/                    # Reusable components
│       ├── auth/                          # Authentication views
│       ├── dashboard-admin.blade.php     # Admin dashboard
│       ├── dashboard-organizer.blade.php  # Organizer dashboard
│       └── home.blade.php                # Landing page
├── routes/
│   └── web.php                           # Web routes
├── storage/                              # Storage directory
├── tests/                                # Test files
├── vendor/                               # Composer dependencies
├── composer.json                         # PHP dependencies
├── package.json                          # Node dependencies
├── vite.config.js                        # Vite configuration
└── .env                                  # Environment variables
```

## 🎯 Usage

### Accessing the Application

1. **Home Page**: `http://localhost:8000/`
2. **Login Page**: `http://localhost:8000/login`
3. **Dashboard**: `http://localhost:8000/dashboard` (requires authentication)

### User Roles

#### Admin Users
- Access admin dashboard with system-wide metrics
- Manage pending booking requests
- View and manage venues
- Access reports and analytics
- Manage equipment
- View feedback reports

#### Organizer Users
- Access organizer dashboard with personal metrics
- Browse available venues
- Create and manage bookings
- View booking status
- Submit feedback

### Development Commands

```bash
# Start development server
php artisan serve

# Run frontend dev server
npm run dev

# Run both (server + frontend + queue)
composer run dev

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Clear caches
php artisan optimize:clear

# Run tests
php artisan test
# or
composer test
```

## 📚 Documentation

Additional documentation files:

- **ROLE_BASED_SIDEBAR_SETUP.md** - Role-based sidebar configuration guide
- **GOOGLE_OAUTH_REDIRECT_SETUP.md** - Google OAuth redirect URI setup
- **AUTHENTICATION_DEBUG_SUMMARY.md** - Authentication troubleshooting

## 🔧 Troubleshooting

### Common Issues

#### BladeCompiler Not Found
```bash
composer dump-autoload
php artisan optimize:clear
php artisan view:cache
```

#### Google OAuth Redirect Mismatch
- Ensure `GOOGLE_REDIRECT_URI` in `.env` matches Google Cloud Console
- Check `APP_URL` is correctly set
- Clear config cache: `php artisan config:clear`

#### Session Issues
- Ensure `SESSION_DRIVER` is set in `.env`
- Run migrations: `php artisan migrate`
- Clear session cache: `php artisan cache:clear`

#### Frontend Assets Not Loading
```bash
npm install
npm run build
# or for development
npm run dev
```

## 🛠️ Technology Stack

- **Backend**: Laravel 12.37.0
- **Frontend**: Tailwind CSS 4.1, Vite 7.0
- **Authentication**: Laravel Socialite (Google OAuth)
- **Database**: MySQL/PostgreSQL
- **Testing**: Pest PHP 4.1
- **Code Quality**: Laravel Pint

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👥 Support

For issues and questions, please refer to the documentation files or contact the development team.

---

**Built with ❤️ for University of Mindanao**
