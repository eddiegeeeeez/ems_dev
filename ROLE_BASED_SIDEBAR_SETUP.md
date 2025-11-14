# Role-Based Sidebar Setup

This document explains how the role-based sidebar system works and how to manage admin users.

## Overview

The system now supports two user roles:
- **ADMIN**: Full access to administrative features
- **ORGANIZER**: Access to organizer features (browse venues, bookings, feedback, profile)

Each role has its own sidebar menu with appropriate navigation items.

## Admin Email Configuration

Admin users are configured via the `config/admin_emails.php` file. To add or remove admin users:

1. Open `config/admin_emails.php`
2. Add or remove email addresses from the `admin_emails` array:

```php
'admin_emails' => [
    'egaran.548856@umindanao.edu.ph',
    'another.admin@umindanao.edu.ph', // Add more as needed
],
```

## How It Works

### Authentication Flow

1. When a user logs in via Google OAuth, the `GoogleController` checks if their email is in the admin emails list
2. If the email matches, the user is assigned the `ADMIN` role and `ADMINISTRATION` department
3. If the email doesn't match, the user is assigned the `ORGANIZER` role and `ORGANISATION ADVISER` department
4. The role is saved to the database and persists across sessions

### Sidebar Display

The system automatically displays the correct sidebar based on the user's role:
- **ADMIN** users see `sidebar-admin.blade.php` with admin menu items
- **ORGANIZER** users see `sidebar-organizer.blade.php` with organizer menu items

The sidebar is conditionally rendered in `resources/views/layouts/app.blade.php`.

## Setting Up Admin Users

### For New Users

New users with admin emails will automatically be assigned the ADMIN role on their first Google login.

### For Existing Users

To update existing users to ADMIN role, you can:

1. **Run the seeder** (recommended):
   ```bash
   php artisan db:seed --class=AdminUserSeeder
   ```

2. **Manually update via database**:
   ```sql
   UPDATE users SET role = 'ADMIN', department = 'ADMINISTRATION' WHERE email = 'egaran.548856@umindanao.edu.ph';
   ```

3. **Update via Tinker**:
   ```bash
   php artisan tinker
   ```
   Then:
   ```php
   $user = App\Models\User::where('email', 'egaran.548856@umindanao.edu.ph')->first();
   $user->role = 'ADMIN';
   $user->department = 'ADMINISTRATION';
   $user->save();
   ```

## Sidebar Components

- **Admin Sidebar** (`resources/views/components/sidebar-admin.blade.php`):
  - Dashboard
  - Pending Requests
  - Venue Calendar
  - Manage Venues
  - Equipment
  - Feedback Reports
  - Reports & Analytics
  - My Profile

- **Organizer Sidebar** (`resources/views/components/sidebar-organizer.blade.php`):
  - Dashboard
  - Browse Venues
  - My Bookings
  - My Feedback
  - My Profile

## Testing

To test the admin access:

1. Ensure your email (`egaran.548856@umindanao.edu.ph`) is in `config/admin_emails.php`
2. If you're already logged in, log out and log back in via Google
3. You should see the Admin Menu sidebar with all admin options
4. Check your user profile - it should show "ADMIN" role

## Troubleshooting

### User not getting ADMIN role

1. Check that the email is exactly as it appears in Google (case-sensitive)
2. Verify the email is in `config/admin_emails.php`
3. Clear config cache: `php artisan config:clear`
4. Log out and log back in
5. Run the seeder: `php artisan db:seed --class=AdminUserSeeder`

### Sidebar showing wrong menu

1. Check the user's role in the database: `SELECT email, role FROM users WHERE email = 'your@email.com';`
2. Verify the role is exactly `ADMIN` (uppercase)
3. Clear view cache: `php artisan view:clear`
4. Log out and log back in

## Notes

- Role assignment happens automatically during Google OAuth login
- Roles are stored in the `users` table in the `role` column
- The system uses uppercase role names: `ADMIN` and `ORGANIZER`
- Legacy `USER` role is still supported but defaults to organizer sidebar

