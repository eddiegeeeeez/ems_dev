# Notifications System - Quick Setup Guide

## What Was Created

✅ **NotificationController** - Handles all notification operations  
✅ **Routes** - 5 notification endpoints added to `routes/web.php`  
✅ **Notification Panel Component** - Header widget showing notifications  
✅ **Full Notifications Page** - `/notifications` route with pagination  
✅ **Documentation** - Complete setup guide (this file + NOTIFICATIONS_SETUP.md)

## Files Modified/Created

| File | Status | Purpose |
|------|--------|---------|
| `app/Http/Controllers/NotificationController.php` | ✅ Created | Controller for notification logic |
| `resources/views/components/notifications-panel.blade.php` | ✅ Created | Header notification panel |
| `resources/views/notifications/index.blade.php` | ✅ Created | Full notifications page view |
| `routes/web.php` | ✅ Updated | Added notification routes |

## Quick Start

### 1. Database Setup
The system uses Laravel's default database notification driver. Ensure your `config/database.php` is set up with the correct database connection.

### 2. Verify Routes
```bash
php artisan route:list | grep notifications
```

Expected output:
```
GET|HEAD notifications → notifications.index
POST notifications/{notificationId}/mark-read → notifications.mark-read
POST notifications/mark-all-read → notifications.mark-all-read
DELETE notifications/{notificationId} → notifications.delete
DELETE notifications/clear-all → notifications.clear-all
```

### 3. Test the Panel
1. Open your dashboard
2. Look for the bell icon in the header (right side)
3. Click to open/close the notification panel
4. Should show "No notifications yet" if no notifications exist

### 4. Send a Test Notification
```php
// In tinker or controller
$user = User::first();
$user->notify(new \Illuminate\Notifications\Messages\MailMessage());
```

Or create a custom notification class:

```bash
php artisan make:notification TestNotification
```

```php
// In app/Notifications/TestNotification.php
public function toDatabase($notifiable)
{
    return [
        'title' => 'Test Notification',
        'message' => 'This is a test notification',
        'type' => 'booking',
    ];
}
```

Then send it:
```php
$user->notify(new TestNotification());
```

## How It Works

### User Sees a Notification
1. **Bell Icon** appears in header with unread count badge
2. **Click Bell** → Panel slides in from right with fadeIn animation
3. **Notification List** shows with type-specific icon (approval/rejection/booking)
4. **Mark as Read** button on unread items
5. **View All** link opens full `/notifications` page

### Mark as Read Flow
1. User clicks "Mark as read" button in panel or full page
2. Form POSTs to `notifications.mark-read` route
3. Controller updates notification's `read_at` timestamp
4. Page redirects back with success message
5. Unread count decrements in panel

### Clear All Flow
1. User clicks "Clear All" button
2. Confirmation dialog appears
3. Form DELETEs to `notifications.clear-all` route
4. All notifications deleted for user
5. Panel shows empty state

## Customization

### Change Notification Colors
Edit `resources/views/components/notifications-panel.blade.php`:

```php
'approval' => [
    'svg' => '<svg...class="h-4 w-4 text-[#4caf50]">', // Change color here
    'label' => 'Approval'
],
```

Or `resources/views/notifications/index.blade.php`:

```blade
<div class="h-10 w-10 rounded-full bg-green-100">
    <!-- Change bg-green-100 to different shade -->
</div>
```

### Adjust Pagination
In `NotificationController.php`:

```php
public function index()
{
    $notifications = auth()->user()->notifications()->paginate(15); // Change 15
    return view('notifications.index', compact('notifications'));
}
```

### Change Animation Speed
Edit `@keyframes fadeIn` in `notifications-panel.blade.php`:

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
/* Change duration in JS: panel.style.animation = 'fadeIn 0.2s ease-in-out'; */
```

## Troubleshooting

### Bell Icon Not Showing
- Check header layout file includes the component: `@include('components.notifications-panel')`
- Verify SVG icon syntax in component
- Check browser console for JavaScript errors

### Notifications Not Appearing
- Verify notifications table exists: `php artisan migrate`
- Check notification is being sent with correct `toDatabase()` method
- Use `php artisan tinker` to test: `User::first()->notifications->count()`

### Styling Issues
- Ensure Tailwind CSS is compiled: `npm run build`
- Check for conflicting CSS in your stylesheet
- Verify custom colors exist in Tailwind config

### Mark as Read Not Working
- Check route exists: `php artisan route:list`
- Verify form CSRF token included (Laravel handles automatically)
- Check browser console for form submission errors

## Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `approval` | ✅ Checkmark | Green (#4caf50) | Booking/Request approved |
| `rejection` | ⚠️ Alert | Red (#c41e3a) | Booking/Request rejected |
| `booking` | 📅 Calendar | Yellow (#ffc107) | New booking received |
| `default` | 🔔 Bell | Gray | Generic notification |

## Important Notes

⚠️ **Ensure you have:**
- Laravel migrations run: `php artisan migrate`
- Tailwind CSS configured in your project
- User model has `Notifiable` trait
- Authentication middleware active on notification routes

📝 **Data Structure:**
All notification data is stored in the `data` JSON column:
```json
{
  "title": "Booking Approved",
  "message": "Your booking has been approved",
  "type": "approval"
}
```

🔒 **Security:**
- All routes protected by `auth` middleware
- Authorization checks prevent users accessing other users' notifications
- CSRF protection on all form submissions
- Delete/Clear operations require confirmation

---

**Documentation:** See `NOTIFICATIONS_SETUP.md` for comprehensive documentation.
