# Notifications System Documentation

## Overview
A complete notification system for the EMS application, featuring:
- Real-time notification panel in the header navbar
- Unread notification badge with pulsing indicator
- Notification list with type-specific icons and styling
- Mark as read functionality
- Full notifications page with pagination
- Multiple notification types (approval, rejection, booking, default)

## Components Created

### 1. **NotificationController** (`app/Http/Controllers/NotificationController.php`)
Handles all notification-related operations.

#### Methods:
- `index()` - Display all user notifications (paginated, 15 per page)
- `markAsRead($notificationId)` - Mark a single notification as read
- `markAllAsRead()` - Mark all unread notifications as read
- `delete($notificationId)` - Delete a specific notification
- `clearAll()` - Clear all notifications for user

#### Security:
- All methods require user authentication
- Authorization checks ensure users can only access their own notifications
- CSRF protection on all POST/DELETE requests

### 2. **Routes** (`routes/web.php`)
Registered under the authenticated middleware group with prefix `/notifications`.

#### Notification Routes:
```php
GET    /notifications                    → notifications.index
POST   /notifications/{id}/mark-read     → notifications.mark-read
POST   /notifications/mark-all-read      → notifications.mark-all-read
DELETE /notifications/{id}               → notifications.delete
DELETE /notifications/clear-all          → notifications.clear-all
```

### 3. **Views**

#### A. Notification Panel (`resources/views/components/notifications-panel.blade.php`)
**Location:** Header navbar as a Blade component

**Features:**
- Bell icon button with unread count badge
- Toggleable notification popover panel
- Fixed positioning (right side of screen)
- Type-specific icons:
  - ✅ **Approval** - Green checkmark
  - ❌ **Rejection** - Red alert icon
  - 📅 **Booking** - Yellow calendar
  - 🔔 **Default** - Gray bell
- Unread notifications highlighted with blue background and left border
- Mark as read button for each unread item
- Empty state display when no notifications
- Link to full notifications page
- Keyboard support (Escape key closes panel)
- Click-outside detection

**Data Structure:**
```php
$notification->data['type']     // 'approval', 'rejection', 'booking', or null
$notification->data['title']    // Notification title
$notification->data['message']  // Notification message
$notification->read_at          // null if unread, datetime if read
$notification->created_at       // When notification was created
```

**Animations:**
- `fadeIn` - 0.2s ease-in-out opacity and transform
- `pulse` - 2s infinite for unread badge

#### B. Notifications Index Page (`resources/views/notifications/index.blade.php`)
**Location:** `/notifications` route

**Features:**
- Displays all user notifications with pagination (15 per page)
- Success message alerts
- Type-specific icons matching panel component
- Individual mark as read and delete buttons
- Clear All button to remove all notifications
- Empty state design with bell icon and message
- Responsive layout for mobile/desktop
- Confirmation dialogs for destructive actions

## Database Requirements

### Laravel Notifications Table
The system uses Laravel's built-in database notification driver.

**Required Table:** `notifications`

**Columns:**
- `id` (uuid/primary)
- `notifiable_id` (foreign key to users)
- `notifiable_type` (model class name)
- `type` (notification class)
- `data` (json - stores title, message, type)
- `read_at` (nullable timestamp)
- `created_at` (timestamp)

**Migration:** Laravel includes default migration in `database/migrations/` folder

### Trigger Migration (if needed):
```bash
php artisan migrate
```

## Usage Examples

### 1. Sending a Notification
```php
use Illuminate\Notifications\Notifiable;

// In your model (e.g., BookingApproved event):
$user->notify(new BookingApproved($booking));
```

### 2. Creating a Custom Notification
```php
namespace App\Notifications;

use Illuminate\Notifications\Notification;

class BookingApproved extends Notification
{
    public function via($notifiable)
    {
        return ['database']; // Store in database
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Booking Approved',
            'message' => 'Your booking for ' . $this->booking->venue_name . ' has been approved',
            'type' => 'approval',
        ];
    }
}
```

### 3. Marking Notifications as Read
**Via Form (in views):**
```blade
<form action="{{ route('notifications.mark-read', $notification->id) }}" method="POST">
    @csrf
    <button type="submit">Mark as read</button>
</form>
```

**Via JavaScript (programmatic):**
```javascript
// The panel includes a form submission button
// No direct AJAX call - uses traditional form POST
```

## Frontend Integration

### Notification Panel in Header
The component is included in `resources/views/layouts/header.blade.php`:

```blade
@include('components.notifications-panel')
```

### JavaScript Functions
- `toggleNotificationPanel()` - Toggle notification panel visibility
- Automatic close on Escape key press
- Automatic close on outside click

### CSS Classes
- `.animate-pulse` - Pulsing animation for unread badge
- `.line-clamp-2` - Truncate notification message to 2 lines
- `.fadeIn` - Fade in animation for panel

## Configuration

### Unread Count Display
- Shown in header as red pulsing dot (when count > 0)
- Displayed in panel header ("You have X unread notification(s)")
- Count updates on page refresh

### Pagination
- 15 notifications per page on full notifications page
- Latest notifications appear first (ordered by `created_at DESC`)

### Time Display
- Panel: Full datetime (e.g., "Nov 15, 2024 at 2:30 PM")
- Index page: Relative time (e.g., "2 hours ago")

## API Endpoints Summary

| Method | Route | Response | Purpose |
|--------|-------|----------|---------|
| GET | `/notifications` | HTML (Blade view) | Display all notifications |
| POST | `/notifications/{id}/mark-read` | Redirect + success message | Mark single as read |
| POST | `/notifications/mark-all-read` | Redirect + success message | Mark all as read |
| DELETE | `/notifications/{id}` | Redirect + success message | Delete notification |
| DELETE | `/notifications/clear-all` | Redirect + success message | Delete all notifications |

## File Locations
- **Controller:** `app/Http/Controllers/NotificationController.php`
- **Panel Component:** `resources/views/components/notifications-panel.blade.php`
- **Full Page View:** `resources/views/notifications/index.blade.php`
- **Routes:** `routes/web.php` (notification routes prefix)
- **Header Integration:** `resources/views/layouts/header.blade.php`

## Testing Checklist
- [ ] Notification bell appears in header
- [ ] Unread badge shows correct count
- [ ] Panel opens/closes with animations
- [ ] Panel closes on Escape key
- [ ] Panel closes on outside click
- [ ] Mark as read button works
- [ ] Notification type icons display correctly
- [ ] Empty state shows when no notifications
- [ ] "View All" link navigates to full page
- [ ] Full page pagination works
- [ ] Clear All button removes all notifications
- [ ] Responsive on mobile devices

## Next Steps (Optional Enhancements)

1. **Real-time Notifications**
   - Implement Laravel Echo + Pusher/Broadcasting
   - Auto-update notification count without page refresh

2. **Notification Preferences**
   - Allow users to control which types they receive
   - Email notifications option

3. **Notification Categories**
   - Filter by type on full page
   - Search functionality

4. **Notification Sounds**
   - Play sound on new notification (with user preference)

5. **Bulk Actions**
   - Select multiple notifications for bulk marking/deletion
