# QR Code Feature Documentation

## Overview

The Event Management System now includes a comprehensive QR code feature that allows:
1. **Automatic QR code generation** for every booking request created
2. **QR code scanning** via camera to quickly find and access bookings
3. **Manual QR code entry** for cases where scanning isn't possible
4. **QR code display and download** in booking details

## System Architecture

### Backend (Laravel)

#### Database
- **Migration**: `2025_11_30_add_qr_code_to_bookings_table.php`
- **New Columns in `bookings` table**:
  - `qr_code_data` (string, unique): The QR code data (format: `UM-EVENT-{ID}-{RANDOM}`)
  - `qr_code_svg` (longText): SVG representation of the QR code

#### Model (Booking)
- **Location**: `app/Models/Booking.php`
- **Key Methods**:
  - `generateQrCode()`: Generates QR code using Endroid QR Code library
  - Auto-generation on booking creation via `boot()` method

#### API Endpoints
- **Location**: `routes/api.php`, `app/Http/Controllers/BookingController.php`
- **Endpoint**: `GET /api/bookings/search/qr-code?qr_code={qr_code}`
- **Response**: 
  ```json
  {
    "success": true,
    "data": { booking object with all relationships }
  }
  ```

### Frontend (Next.js/React)

#### Components

1. **QrScanner** (`components/qr-scanner.tsx`)
   - Features:
     - Real-time camera QR code scanning using jsQR library
     - Manual QR code entry fallback
     - User-friendly UI with start/stop controls
     - Error handling for camera access issues
   - Props:
     - `open` (boolean): Controls modal visibility
     - `onClose` (function): Closes the scanner
     - `onScanResult` (function): Callback with scanned QR code data

2. **QrCodeDisplay** (`components/qr-code-display.tsx`)
   - Features:
     - Displays QR code as image
     - Download QR code as PNG
     - Copy QR code data to clipboard
     - Shows QR code identifier
   - Props:
     - `bookingId` (string): Booking identifier
     - `qrCodeData` (string): QR code content
     - `qrCodeSvg` (string): SVG version of QR code
     - `eventTitle` (string): Event name for context

3. **BookingDetailsModal** (Updated `components/booking-details-modal.tsx`)
   - Integrated QrCodeDisplay component
   - Shows QR code when booking details are viewed
   - Displays in modal for easy reference and download

#### Pages

1. **Admin Requests Page** (`app/admin/requests/page.tsx`)
   - Added "Scan QR Code" button in header
   - Integrated QrScanner component
   - Handles QR scan results by:
     - Parsing QR code data (format: `UM-EVENT-{ID}-{RANDOM}`)
     - Extracting booking ID
     - Opening booking details modal automatically

## QR Code Format

QR codes follow this pattern:
```
UM-EVENT-{BOOKING_ID}-{RANDOM_8_CHARS}
```

Example:
```
UM-EVENT-123-ABC12XYZ
```

This format allows for:
- Quick identification of event-related QR codes
- Extraction of booking ID
- Additional entropy for uniqueness and security

## Installation & Setup

### Backend Setup

1. **Run Migration**:
   ```bash
   php artisan migrate
   ```
   This creates the `qr_code_data` and `qr_code_svg` columns in the bookings table.

2. **Dependencies**:
   - `endroid/qr-code` (^6.1): PHP QR code generation
   - Already installed, no additional action needed

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install jsqr --legacy-peer-deps
   ```
   - `jsqr`: JavaScript library for QR code decoding
   - `qrcode`: Already installed for QR code generation in browser

2. **No additional configuration needed** - components are ready to use

## Usage

### For Admins

1. **Navigate to Booking Requests page** (`/admin/requests`)
2. **Click "Scan QR Code" button** in the header
3. **Choose one of two options**:
   - **Camera Scanning**: Click "Start Scanning" and point camera at QR code
   - **Manual Entry**: Enter QR code data in the text field
4. **Result**: Booking details modal opens automatically

### For All Users

1. **View Booking Details**: Click on any booking
2. **QR Code Section**: Visible at the bottom of the modal
3. **Options**:
   - **Download**: Save QR code as PNG image
   - **Copy Code**: Copy QR code identifier to clipboard

## API Usage

### Search Booking by QR Code

**Endpoint**: `GET /api/bookings/search/qr-code`

**Query Parameters**:
- `qr_code` (string, required): The QR code data

**Request Example**:
```
GET /api/bookings/search/qr-code?qr_code=UM-EVENT-123-ABC12XYZ
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "event_title": "Annual Conference",
    "event_description": "...",
    "start_datetime": "2025-12-01T09:00:00Z",
    "end_datetime": "2025-12-01T17:00:00Z",
    "expected_attendees": 150,
    "status": "approved",
    "venue": { ... },
    "user": { ... },
    "equipment": [ ... ],
    "qr_code_data": "UM-EVENT-123-ABC12XYZ",
    "qr_code_svg": "...",
    ...
  }
}
```

**Response (Not Found)**:
```json
{
  "success": false,
  "message": "Booking not found"
}
```

## Security Considerations

1. **Authentication**: All QR code endpoints require user authentication
2. **Authorization**: Users can only search/view their own bookings or admin-specific data
3. **Rate Limiting**: Consider implementing rate limiting on search endpoint
4. **Data Validation**: QR code data is validated before database queries

## Future Enhancements

1. **Batch QR Code Generation**: Generate QR codes for multiple bookings
2. **QR Code Email**: Send QR codes to event organizers via email
3. **Check-in System**: Scan QR codes to mark attendance
4. **Mobile App**: Native mobile app with built-in QR scanning
5. **Advanced Scanning**: Support for different QR code formats
6. **Analytics**: Track QR code scans and interactions

## Troubleshooting

### Camera Not Working
- **Issue**: "Unable to access camera" error
- **Solutions**:
  - Check browser camera permissions
  - Ensure HTTPS connection (required for camera access)
  - Try different browser
  - Restart browser

### QR Code Not Scanning
- **Issue**: Scanner can't read QR code
- **Solutions**:
  - Ensure QR code is clearly visible and not damaged
  - Increase camera light/brightness
  - Try moving camera closer/farther from QR code
  - Use manual entry as fallback

### QR Code Not Generating
- **Issue**: New bookings don't have QR codes
- **Solutions**:
  - Check migration was run: `php artisan migrate`
  - Check error logs: `storage/logs/laravel.log`
  - Verify Endroid QR Code library is installed

### Permission Denied
- **Issue**: Can't view/search bookings
- **Solutions**:
  - Ensure user is authenticated
  - For admin features, ensure user has admin role
  - Check user permissions in database

## Files Modified/Created

### Backend
- `database/migrations/2025_11_30_add_qr_code_to_bookings_table.php` (Created)
- `app/Models/Booking.php` (Modified - added QR code generation)
- `app/Http/Controllers/BookingController.php` (Modified - added searchByQrCode method)
- `routes/api.php` (Modified - added QR code search endpoint)

### Frontend
- `components/qr-scanner.tsx` (Created)
- `components/qr-code-display.tsx` (Created)
- `components/booking-details-modal.tsx` (Modified - added QR code display)
- `app/admin/requests/page.tsx` (Modified - added scanner button and integration)

### Dependencies Added
- Backend: `endroid/qr-code` (^6.1)
- Frontend: `jsqr`

## Testing Checklist

- [ ] Run migration: `php artisan migrate`
- [ ] Create a test booking - QR code should auto-generate
- [ ] Check QR code appears in booking details modal
- [ ] Download QR code - should save PNG file
- [ ] Copy QR code data - should copy to clipboard
- [ ] Open scanner on admin requests page
- [ ] Test camera scanning with generated QR code
- [ ] Test manual QR code entry
- [ ] Verify correct booking opens when QR code is scanned
- [ ] Test API endpoint: `GET /api/bookings/search/qr-code?qr_code=...`
- [ ] Test permission checks (user can't access other user's bookings)

## Support

For issues or questions regarding QR code functionality:
1. Check this documentation
2. Review error logs: `storage/logs/laravel.log`
3. Check browser console for JavaScript errors
4. Test with different QR codes/devices
5. Contact development team if issue persists
