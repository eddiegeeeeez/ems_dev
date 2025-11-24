# 🚀 Quick Start Guide - Event Management System

**Status: ✅ FULLY FUNCTIONAL & READY FOR TESTING**

---

## ⚡ Fastest Way to Start Testing

### Option 1: Automated Start (Recommended)
```powershell
cd 'c:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev'
.\start-servers.ps1
```

This script will:
- Start Laravel backend (Port 8000)
- Start Next.js frontend (Port 3000)
- Check server status
- Open browser automatically

### Option 2: Manual Start
```powershell
# Terminal 1 - Backend
cd 'c:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev'
php artisan serve --port=8000

# Terminal 2 - Frontend
cd 'c:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev\frontend'
npm run dev
```

---

## 🧪 Testing the System

### Quick API Test Script
```powershell
cd 'c:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev'
.\test-api.ps1
```

This interactive menu lets you:
1. Test backend health
2. Test database connection
3. Login as admin/organizer
4. View all API routes
5. Test specific endpoints
6. View database statistics
7. Clear cache

---

## 🔐 Login Methods

### Method 1: Quick Development Login
**Admin:**
```
http://localhost:8000/temp-login/admin
```

**Organizer:**
```
http://localhost:8000/temp-login/organizer
```

### Method 2: Google OAuth
1. Go to http://localhost:3000
2. Click "Login with Google"
3. Authenticate with your Google account

### Method 3: Direct Credentials
- **Admin:** admin@ems.edu / password
- **Organizer:** sarah.j@ems.edu / password

---

## 📋 System Overview

### ✅ What's Working

| Component | Status | Details |
|-----------|--------|---------|
| **Backend API** | 🟢 | 68 endpoints, all return JSON |
| **Database** | 🟢 | MySQL with complete test data |
| **Frontend** | 🟢 | Next.js 14 + TypeScript |
| **Authentication** | 🟢 | Google OAuth + Sessions |
| **CORS** | 🟢 | Configured for localhost |
| **Controllers** | 🟢 | All converted to JSON API |

### 📊 Test Data Available

- **17 Users** (2 admins, 15 organizers)
- **14 Venues** (13 active, 1 under maintenance)
- **36 Equipment Items** (across 6 departments)
- **15 Bookings** (various statuses)
- **11 Notifications** (for different users)
- **15 Maintenance Requests**
- **6 Departments**

---

## 🎯 Testing Scenarios

### 1. User Flow (Organizer)
1. Login as organizer
2. Browse venues
3. Create a booking
4. View booking status
5. Check notifications

### 2. Admin Flow
1. Login as admin
2. View dashboard statistics
3. Approve/reject bookings
4. Manage equipment
5. View reports

### 3. API Testing
1. Test health endpoint
2. Test venues list
3. Test booking creation
4. Test admin endpoints
5. Test notifications

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend | http://localhost:8000 | API server |
| API Base | http://localhost:8000/api | API endpoints |
| Health Check | http://localhost:8000/up | Server status |
| Admin Login | http://localhost:8000/temp-login/admin | Quick admin access |

---

## 📚 Documentation Files

1. **SYSTEM_CONNECTIVITY_REPORT.md** - Complete system analysis
2. **DATABASE_SETUP_COMPLETE.md** - Database details
3. **CONTROLLER_CONVERSION_SUMMARY.md** - API endpoints documentation
4. **IMPLEMENTATION_PROGRESS.md** - Project status

---

## 🛠️ Useful Commands

### Backend Commands
```powershell
# Start server
php artisan serve --port=8000

# View routes
php artisan route:list --path=api

# Test database
php artisan tinker --execute="echo App\Models\User::count();"

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### Frontend Commands
```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Commands
```powershell
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

---

## 🐛 Troubleshooting

### Backend not starting?
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Try different port
php artisan serve --port=8001
```

### Frontend not starting?
```powershell
# Clear Next.js cache
cd frontend
Remove-Item -Recurse -Force .next

# Reinstall dependencies
npm install

# Start again
npm run dev
```

### Database issues?
```powershell
# Check connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Reset database
php artisan migrate:fresh --seed
```

---

## 📞 Quick Reference

### Test Accounts
```
Admin:
  Email: admin@ems.edu
  Password: password
  
Organizer:
  Email: sarah.j@ems.edu
  Password: password
```

### API Endpoints (Sample)
```
GET    /api/venues              - List venues
GET    /api/bookings            - List bookings
POST   /api/bookings            - Create booking
GET    /api/dashboard           - User dashboard
GET    /api/admin/dashboard     - Admin dashboard
GET    /api/admin/requests      - Pending requests
POST   /api/admin/requests/{id}/approve - Approve booking
```

---

## ✨ Features Ready for Testing

### User Features
- ✅ Google OAuth login
- ✅ Browse venues with filters
- ✅ View venue details and availability
- ✅ Create bookings with equipment
- ✅ View booking history
- ✅ Receive notifications
- ✅ Submit feedback
- ✅ Update profile

### Admin Features
- ✅ Dashboard with statistics
- ✅ Approve/reject bookings
- ✅ Manage venues (CRUD)
- ✅ Manage equipment (CRUD)
- ✅ Manage users
- ✅ View calendar
- ✅ Generate reports
- ✅ Maintenance scheduling
- ✅ Audit logs
- ✅ System settings

---

## 🎉 You're Ready to Test!

**Everything is set up and working. Start testing by:**

1. Run `.\start-servers.ps1` to start both servers
2. Open http://localhost:3000 in your browser
3. Login using one of the methods above
4. Start exploring the features!

**For API testing:**
1. Run `.\test-api.ps1` for interactive testing
2. Or use Postman with the API endpoints
3. Check `SYSTEM_CONNECTIVITY_REPORT.md` for detailed endpoint documentation

---

**Need Help?**
- Check `SYSTEM_CONNECTIVITY_REPORT.md` for detailed information
- Review `DATABASE_SETUP_COMPLETE.md` for data structure
- See `CONTROLLER_CONVERSION_SUMMARY.md` for API documentation

**Happy Testing! 🚀**
