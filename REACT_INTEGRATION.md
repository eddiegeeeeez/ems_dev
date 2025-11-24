# Event Management System - React + Laravel Integration

## 🎉 Setup Complete!

Your project has been successfully configured to use React (Next.js) as the frontend and Laravel as the API backend.

## 📁 Project Structure

```
ems_dev/
├── app/                    # Laravel backend
├── frontend/              # React Next.js frontend
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # Utilities (including api.ts)
│   └── .env.local        # Frontend environment variables
├── routes/
│   ├── api.php           # API routes (for React)
│   └── web.php           # Web routes (legacy Blade)
├── config/
│   ├── cors.php          # CORS configuration
│   └── sanctum.php       # API authentication
└── INTEGRATION_GUIDE.md  # Detailed integration guide
```

## 🚀 Quick Start

### 1. Start Laravel Backend

Open a terminal and run:

```bash
cd "C:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev"
php artisan serve
```

Backend API will be available at: **http://localhost:8000/api**

### 2. Start React Frontend

Open a **new terminal** and run:

```bash
cd "C:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev\frontend"
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## ✅ What's Been Configured

### Backend (Laravel)
- ✅ API routes created in `routes/api.php`
- ✅ Laravel Sanctum installed for API authentication
- ✅ CORS configured to allow React app requests
- ✅ Environment variables set up
- ✅ All endpoints return JSON responses

### Frontend (React/Next.js)
- ✅ Project copied to `frontend/` directory
- ✅ API client created in `lib/api.ts`
- ✅ Environment variables configured
- ✅ Ready to connect to Laravel backend

## 🔗 Available API Endpoints

### Public
- `GET /api/health` - Check API status

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout

### User Endpoints (Authenticated)
- `GET /api/dashboard` - Dashboard data
- `GET /api/venues` - List venues
- `GET /api/bookings` - User bookings
- `POST /api/bookings` - Create booking
- `GET /api/notifications` - User notifications

### Admin Endpoints (Admin role required)
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/requests` - Booking requests
- `POST /api/admin/requests/{id}/approve` - Approve booking
- `GET /api/admin/venues` - Manage venues
- `GET /api/admin/equipment` - Manage equipment
- `GET /api/admin/users` - Manage users
- `GET /api/admin/departments` - Manage departments
- `GET /api/admin/reports/*` - Various reports

See `INTEGRATION_GUIDE.md` for complete API documentation.

## 💻 Using the API in React

The API client is already created in `frontend/lib/api.ts`. Here's how to use it:

```typescript
import { apiClient } from '@/lib/api';

// Get venues
const venues = await apiClient.getVenues();

// Create booking
const booking = await apiClient.createBooking({
  venue_id: 1,
  start_time: '2025-11-25 10:00:00',
  end_time: '2025-11-25 12:00:00',
  purpose: 'Meeting'
});

// Admin: Approve booking
await apiClient.approveBooking('123');
```

## 🔐 Authentication Flow

1. User clicks "Login with Google" button
2. Redirect to: `http://localhost:8000/api/auth/google`
3. After OAuth, user is returned to React app
4. Frontend calls `/api/auth/user` to get user data
5. All subsequent requests include authentication cookies automatically

Example login button:

```typescript
import { apiClient } from '@/lib/api';

function LoginButton() {
  return (
    <button onClick={() => apiClient.loginWithGoogle()}>
      Login with Google
    </button>
  );
}
```

## 📝 Next Steps

### Required: Update Controllers

Your Laravel controllers need to return JSON responses instead of Blade views. Here's an example:

**Before (Blade):**
```php
public function index() {
    $venues = Venue::all();
    return view('venues.index', compact('venues'));
}
```

**After (API):**
```php
public function index() {
    $venues = Venue::all();
    return response()->json($venues);
}
```

### Recommended Updates

1. **Update React Components**: Replace mock data with API calls
2. **Add Error Handling**: Handle API errors in React components
3. **Add Loading States**: Show loading indicators during API calls
4. **Setup Database**: Run migrations and seed data
5. **Test API Endpoints**: Use Postman or browser to test each endpoint

## 🗄️ Database Setup

1. Create MySQL database:
   ```sql
   CREATE DATABASE ems_dev;
   ```

2. Run migrations:
   ```bash
   php artisan migrate
   ```

3. (Optional) Seed data:
   ```bash
   php artisan db:seed
   ```

## 🔧 Configuration Files

### Backend Configuration

**`.env`** - Laravel environment variables
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
DB_DATABASE=ems_dev
```

**`config/cors.php`** - CORS settings
```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:3001',
],
```

### Frontend Configuration

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure both servers are running
- Check `config/cors.php` includes frontend URL
- Verify `credentials: 'include'` in API calls

### Authentication Not Working
- Clear browser cookies
- Check `SESSION_DOMAIN` in `.env`
- Verify Google OAuth credentials

### API Returns 404
- Check route is in `routes/api.php`
- Verify URL starts with `/api/`
- Run `php artisan route:list` to see all routes

### Frontend Can't Connect
- Check API URL in `.env.local`
- Ensure Laravel server is running
- Check browser console for errors

## 📚 Resources

- **Integration Guide**: `INTEGRATION_GUIDE.md` (detailed documentation)
- **Laravel Docs**: https://laravel.com/docs
- **Laravel Sanctum**: https://laravel.com/docs/sanctum
- **Next.js Docs**: https://nextjs.org/docs
- **API Client**: `frontend/lib/api.ts`

## 🎯 Development Workflow

1. **Start both servers** (Laravel on 8000, Next.js on 3000)
2. **Make changes** to React components or Laravel controllers
3. **Test in browser** at http://localhost:3000
4. **Check API responses** in browser DevTools Network tab
5. **Review Laravel logs** in `storage/logs/laravel.log`

## 📞 Need Help?

- Check `INTEGRATION_GUIDE.md` for detailed documentation
- Review Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors
- Use `php artisan route:list` to see all API routes

---

**Happy Coding! 🚀**

Your Laravel backend is now serving as a RESTful API, and your React frontend is ready to consume it!
