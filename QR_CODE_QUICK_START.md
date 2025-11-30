# QR Code Feature - Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### Step 1: Run Database Migration
```bash
cd c:\Users\z87kc4ivan\Downloads\it9\ems_dev
php artisan migrate
```
✅ This adds QR code columns to the bookings table

### Step 2: Verify Composer Package
```bash
composer show endroid/qr-code
```
✅ Should show: `endroid/qr-code ^6.1`

### Step 3: Install Frontend Dependency
```bash
cd frontend
npm install jsqr --legacy-peer-deps
npm run build
```
✅ Installs QR scanner library

### Step 4: Start Development Server
```bash
npm run dev
```
✅ Frontend ready at http://localhost:3000

---

## 🎯 Using QR Codes

### For Admins - Scan QR Codes

1. Go to `/admin/requests` (Booking Requests page)
2. Click **"Scan QR Code"** button (top right)
3. Choose:
   - **Camera**: Point at QR code
   - **Manual**: Type in QR code
4. ✅ Booking automatically opens

### For All Users - View QR Codes

1. Click on any booking to see details
2. Scroll to **"Booking QR Code"** section
3. Options:
   - **Download**: Save as PNG file
   - **Copy Code**: Copy to clipboard

---

## 🧪 Test It Out

### Create a Test Booking
1. Create new booking through user interface
2. Check booking details
3. **QR code should appear automatically** ✅

### Scan the QR Code
1. Go to admin requests page
2. Click "Scan QR Code"
3. Scan the generated QR code
4. **Booking details should open** ✅

### Download QR Code
1. Open booking details
2. Click "Download" on QR code section
3. **PNG file should download** ✅

---

## 📝 QR Code Format

All QR codes follow this format:
```
UM-EVENT-{BOOKING_ID}-{RANDOM_8_CHARS}
```

**Example**: `UM-EVENT-123-ABC12XYZ`

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Camera not working | Check browser permissions, use HTTPS |
| QR code not scanning | Try manual entry, ensure code is visible |
| QR not generating | Run migration: `php artisan migrate` |
| Permission denied | Ensure admin user, check roles |

---

## 📚 Full Documentation

See these files for detailed information:
- `QR_CODE_FEATURE_DOCUMENTATION.md` - Complete documentation
- `QR_CODE_IMPLEMENTATION_SUMMARY.md` - Implementation details

---

## ✅ Verification Checklist

- [ ] Migration ran successfully
- [ ] Can create new booking
- [ ] QR code appears in booking details
- [ ] Can download QR code
- [ ] Can copy QR code data
- [ ] Scanner button appears on admin page
- [ ] Can scan QR codes
- [ ] Can enter QR code manually
- [ ] Booking opens after scan

---

## 🚀 Ready to Deploy?

Once all items in the verification checklist are complete:

1. **Run tests**: `php artisan test`
2. **Build frontend**: `npm run build`
3. **Deploy to production**
4. **Monitor**: Check logs for any errors

---

## 📞 Need Help?

1. Check error logs: `storage/logs/laravel.log`
2. Check browser console (F12 → Console tab)
3. Review documentation files
4. Check database: `qr_code_data` and `qr_code_svg` columns exist

---

## 🎉 Feature Summary

✅ Automatic QR code generation on booking creation
✅ Real-time QR code scanning with camera
✅ Manual QR code entry fallback
✅ QR code display with download option
✅ Quick booking lookup via QR scan
✅ Secure & permission-based access

Enjoy your QR code feature! 🎊
