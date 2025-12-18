# Event Management System (EMS)

A comprehensive venue booking and event scheduling platform designed for the University of Mindanao. This system facilitates the management of campus events, venue reservations, and equipment requests through a streamlined digital interface.

![System Architecture](https://img.shields.io/badge/Architecture-Monolithic%20(Decoupled)-blue)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black)
![Backend](https://img.shields.io/badge/Backend-Laravel%2012-red)
![Database](https://img.shields.io/badge/Database-MySQL-orange)

## 🏗 System Architecture

The application follows a decoupled monolithic architecture where the frontend and backend are separate projects but interact via a RESTful API.

```mermaid
graph LR
    User[User (Browser)] <-->|HTTPS / JSON| Frontend[Next.js Frontend]
    Frontend <-->|REST API| Backend[Laravel Backend]
    Backend <-->|SQL| DB[(MySQL Database)]
```

### Technology Stack

#### Frontend (`/frontend`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **State/Data**: React Context, Custom Hooks
- **HTTP Client**: Native Fetch API (wrapped)

#### Backend (`/backend`)
- **Framework**: [Laravel 12](https://laravel.com/)
- **Language**: PHP 8.2+
- **Authentication**: Laravel Sanctum (SPA Authentication)
- **Database**: MySQL
- **ORM**: Eloquent
- **Features**: 
    - API Resources
    - Database Notifications
    - Audit Logging (via `AuditService`)

---

## 🚀 Key Features

### 👤 User Roles
- **Administrator**: Full system control. Can manage usage trends, view all bookings, manage users/departments/venues/equipment, and configure system settings.
- **Event Organizer**: Can browse venues, create booking requests, manage their own bookings, and receive notifications.

### 📅 Core Functionalities
- **Venue Management**: Add, edit, and categorize campus venues (Auditoriums, Labs, etc.).
- **Equipment Inventory**: Manage available equipment (Projectors, Chairs, etc.) and track stock.
- **Booking Workflow**:
    1.  Organizer checks venue availability.
    2.  Organizer submits booking request with equipment needs and documents.
    3.  Admin reviews request (Approve/Reject).
    4.  Notifications sent to relevant parties.
- **Real-time Notifications**: In-app alerts for status changes and new requests.
- **System Settings**: Configurable booking rules (e.g., advance notice requirements) and terms.

---

## 🛠 Setup Instructions

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL Server

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install PHP dependencies:
```bash
composer install
```

Configure environment:
```bash
cp .env.example .env
# Edit .env and configure your database credentials (DB_DATABASE, DB_USERNAME, etc.)
```

Generate application key:
```bash
php artisan key:generate
```

Run database migrations:
```bash
php artisan migrate
```

Start the backend server:
```bash
php artisan serve
# Server runs at http://localhost:8000
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install Node dependencies:
```bash
npm install
```

Configure environment:
```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

Start the development server:
```bash
npm run dev
# App runs at http://localhost:3000
```

---

## 🔒 Security
- **Authentication**: Secure cookie-based session management via Laravel Sanctum.
- **CSRF Protection**: Native CSRF token handling.
- **Authorization**: Role-based policies ensuring users access only what they are permitted to.

## 🤝 Contribution
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
