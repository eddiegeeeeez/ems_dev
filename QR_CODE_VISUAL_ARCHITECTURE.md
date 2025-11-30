# QR Code System - Visual Architecture

## System Flow Diagram

```
╔════════════════════════════════════════════════════════════════════════════╗
║                     EVENT MANAGEMENT SYSTEM - QR CODE FLOW                 ║
╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: BOOKING CREATION                                                 │
└──────────────────────────────────────────────────────────────────────────┘

    User Creates Booking
    │
    ├─► BookingController::store()
    │       │
    │       ├─► Validate Input
    │       │
    │       ├─► Booking::create()
    │       │   (Database Insert)
    │       │
    │       └─► Booking Model Boot Method
    │           │
    │           └─► QR Code Auto-Generation
    │               │
    │               ├─ Generate QR Data
    │               │  "UM-EVENT-{ID}-{RANDOM}"
    │               │
    │               ├─ Generate QR SVG
    │               │  (Endroid\QrCode)
    │               │
    │               └─ Save to Database
    │                  qr_code_data ✓
    │                  qr_code_svg ✓
    │
    └─► Booking Complete with QR Code ✓


┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: DISPLAYING QR CODE                                               │
└──────────────────────────────────────────────────────────────────────────┘

    User Opens Booking Details
    │
    ├─► BookingDetailsModal Component
    │   │
    │   └─► QrCodeDisplay Component
    │       │
    │       ├─ Display QR Code Image
    │       │  (Generated from qrcode lib)
    │       │
    │       ├─ Show QR Code Data
    │       │  "UM-EVENT-123-ABC12XYZ"
    │       │
    │       └─ Display Actions
    │          ├─ Download QR (PNG)
    │          └─ Copy Code
    │
    └─► User Can Download/Share QR Code ✓


┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: SCANNING QR CODE (Admin Flow)                                    │
└──────────────────────────────────────────────────────────────────────────┘

    Admin Clicks "Scan QR Code" Button
    │
    ├─► QrScanner Component Opens
    │   │
    │   └─► User Options
    │       │
    │       ├─ OPTION A: Camera Scan
    │       │  │
    │       │  ├─ Request Camera Permission
    │       │  │
    │       │  ├─ Start Video Stream
    │       │  │  (navigator.mediaDevices.getUserMedia)
    │       │  │
    │       │  ├─ Process Video Frames
    │       │  │  (Canvas + jsQR)
    │       │  │
    │       │  ├─ Detect QR Code
    │       │  │
    │       │  └─ Extract Data
    │       │     "UM-EVENT-123-ABC12XYZ"
    │       │
    │       └─ OPTION B: Manual Entry
    │           │
    │           └─ User Types QR Code
    │              "UM-EVENT-123-ABC12XYZ"
    │
    ├─ Parse QR Data
    │  │
    │  └─ Extract: UM | EVENT | ID | RANDOM
    │
    ├─ Search for Booking
    │  │
    │  └─► handleQrScanResult()
    │      │
    │      └─► Find Booking by ID
    │
    └─► BookingDetailsModal Opens Automatically ✓


┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: API SEARCH (Backend)                                             │
└──────────────────────────────────────────────────────────────────────────┘

    Frontend: QrScanner → onScanResult()
    │
    └─► API Call: GET /api/bookings/search/qr-code
        │
        └─► BookingController::searchByQrCode()
            │
            ├─ Validate Input
            │  └─ qr_code parameter required
            │
            ├─ Query Database
            │  └─ Booking::where('qr_code_data', qr_code)
            │
            ├─ Check Permissions
            │  └─ Authorization check
            │
            └─ Return Response
               │
               ├─ Success 200: Booking data
               └─ Not Found 404: Error message

```

---

## Component Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT HIERARCHY                               │
└─────────────────────────────────────────────────────────────────────────┘

AdminRequestsPage
├── Header
│   └── Button "Scan QR Code" ◄─── NEW
│       └── onClick: setIsScannerOpen(true)
│
├── Tabs & Table
│   ├── Pending Requests
│   ├── Approved Requests
│   └── Rejected Requests
│
├── BookingDetailsModal
│   └── QrCodeDisplay ◄─── NEW
│       ├── Show QR Code Image
│       ├── Download Button
│       └── Copy Code Button
│
└── QrScanner ◄─── NEW
    ├── Dialog Container
    ├── Video Stream
    ├── Canvas (hidden)
    ├── Start/Stop Controls
    └── Manual Input Fallback
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                         │
└─────────────────────────────────────────────────────────────────────────┘

BOOKING TABLE (Database)
┌──────────────────────────────────────┐
│ id                      (INT)        │
│ user_id                 (INT)        │
│ venue_id                (INT)        │
│ event_name              (VARCHAR)    │
│ event_description       (TEXT)       │
│ start_datetime          (DATETIME)   │
│ end_datetime            (DATETIME)   │
│ expected_attendees      (INT)        │
│ status                  (ENUM)       │
│ total_cost              (DECIMAL)    │
│ qr_code_data ◄──────────(VARCHAR*)   │ ◄─── NEW
│ qr_code_svg ◄───────────(LONGTEXT)   │ ◄─── NEW
│ created_at              (TIMESTAMP)  │
│ updated_at              (TIMESTAMP)  │
│ deleted_at              (TIMESTAMP)  │
└──────────────────────────────────────┘
        │
        │ (ON CREATE)
        │
        ▼
  Booking Model
        │
        ├─► generateQrCode()
        │   │
        │   ├─ QrCode Instance
        │   │  └─ "UM-EVENT-123-ABC12XYZ"
        │   │
        │   ├─ SvgWriter
        │   │  └─ SVG String
        │   │
        │   └─ Save QR Fields
        │
        ▼
  Database Updated ✓
  (qr_code_data + qr_code_svg)
        │
        ├─► Frontend Display
        │   └─ QrCodeDisplay Component
        │
        └─► API Search
            └─ BookingController::searchByQrCode()
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                                    │
└─────────────────────────────────────────────────────────────────────────┘

BACKEND (PHP/Laravel)
├── Framework
│   └── Laravel 11.x
├── Libraries
│   ├── endroid/qr-code ^6.1 ◄─── QR Generation
│   └── Eloquent ORM
└── Database
    └── MySQL / MariaDB


FRONTEND (React/Next.js)
├── Framework
│   └── Next.js 16.x + React 19.x
├── Libraries
│   ├── jsqr ◄─── QR Decoding
│   ├── qrcode ◄─── QR Generation (existing)
│   └── Shadcn UI (existing)
└── Browser APIs
    └── navigator.mediaDevices.getUserMedia() ◄─── Camera Access


DATABASE
├── Schema
│   └── bookings table (with QR columns)
├── Indexes
│   └── UNIQUE(qr_code_data)
└── Storage
    └── SVG + Data fields
```

---

## Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              API ENDPOINT: GET /api/bookings/search/qr-code              │
└─────────────────────────────────────────────────────────────────────────┘

REQUEST
─────────────────────────────────────────────────────────────────────────
GET /api/bookings/search/qr-code?qr_code=UM-EVENT-123-ABC12XYZ
Authorization: Bearer {token}


PROCESSING
─────────────────────────────────────────────────────────────────────────
1. Validate Request
   └─ qr_code parameter required

2. Check Authentication
   └─ Token verification

3. Query Database
   └─ SELECT * FROM bookings WHERE qr_code_data = ?

4. Check Authorization
   └─ User permissions verified

5. Load Relationships
   ├─ venue
   ├─ user
   └─ equipment


RESPONSE (SUCCESS - 200)
─────────────────────────────────────────────────────────────────────────
{
  "success": true,
  "data": {
    "id": "123",
    "event_title": "Annual Conference",
    "event_description": "Company annual conference",
    "start_datetime": "2025-12-01T09:00:00Z",
    "end_datetime": "2025-12-01T17:00:00Z",
    "expected_attendees": 150,
    "status": "approved",
    "venue": {
      "id": "1",
      "name": "Grand Hall",
      "location": "Building A, Room 101"
    },
    "user": {
      "id": "5",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "equipment": [ ... ],
    "qr_code_data": "UM-EVENT-123-ABC12XYZ",
    "qr_code_svg": "<svg>...</svg>",
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T10:00:00Z"
  }
}


RESPONSE (NOT FOUND - 404)
─────────────────────────────────────────────────────────────────────────
{
  "success": false,
  "message": "Booking not found"
}


RESPONSE (UNAUTHORIZED - 403)
─────────────────────────────────────────────────────────────────────────
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    REACT STATE MANAGEMENT                                │
└─────────────────────────────────────────────────────────────────────────┘

AdminRequestsPage
├── State: filter
│   └─ Values: "pending" | "approved" | "rejected"
│
├── State: selectedBooking
│   └─ Value: Booking object | null
│
├── State: isModalOpen
│   └─ Value: boolean
│
├── State: isScannerOpen ◄─── NEW
│   └─ Value: boolean
│
└── State: columnVisibility
    └─ Various column visibility flags


QrScanner Component
├── State: isScanning
│   └─ Value: boolean
│
├── State: scannerActive ◄─── NEW
│   └─ Value: boolean
│
├── State: error
│   └─ Value: string | null
│
├── State: manualInput
│   └─ Value: string
│
└── Refs
    ├── videoRef (HTMLVideoElement)
    └── canvasRef (HTMLCanvasElement)


QrCodeDisplay Component
├── State: qrUrl
│   └─ Value: Data URL string
│
├── State: copied
│   └─ Value: boolean
│
└── Effect: Generate QR on mount/update
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                                     │
└─────────────────────────────────────────────────────────────────────────┘

LAYER 1: Authentication
├── Sanctum Tokens
├── Google OAuth (existing)
└── Session Verification

LAYER 2: Authorization
├── Role-based Access Control
│   ├── Admin: Full access
│   └── User: Own bookings only
└── Permission Middleware

LAYER 3: Data Protection
├── Unique Constraint
│   └─ qr_code_data (UNIQUE)
├── SQL Injection Prevention
│   └─ Parameterized Queries (ORM)
└── HTTPS Required
    └─ Camera access requires secure connection

LAYER 4: Input Validation
├── QR Code Format Validation
├── Parameter Type Checking
└── SQL Injection Prevention

LAYER 5: Output Protection
├── JSON Escaping
├── XSS Prevention
└── CORS Configuration
```

---

## Performance Metrics

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE CHARACTERISTICS                           │
└─────────────────────────────────────────────────────────────────────────┘

QR Code Generation
├── Time: ~50-100ms
├── Size: SVG ~2-5KB
├── Async: Yes (non-blocking)
└── Storage: Database

QR Code Scanning
├── Processing: Real-time
├── Latency: <100ms per frame
├── CPU: Minimal (jsQR optimized)
└── Memory: ~5-10MB for video stream

API Search
├── Query Time: ~10-20ms
├── Network: ~50-100ms (typical)
├── Response Size: ~5-20KB
└── Cache Friendly: Yes

Database
├── Write: 1 INSERT + 1 UPDATE
├── Read: 1 SELECT per search
├── Index: UNIQUE on qr_code_data
└── Storage: ~2-5MB per 1000 bookings
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                                   │
└─────────────────────────────────────────────────────────────────────────┘

DEVELOPMENT
├── Local Machine
├── Feature Branch
└── All tests passing

STAGING
├── Deploy Frontend
│   └─ npm run build → Deploy
├── Deploy Backend
│   └─ php artisan migrate → Deploy
└── Integration Testing

PRODUCTION
├── Database Migration
│   └─ php artisan migrate --prod
├── Backend Deployment
│   ├─ Code Push
│   ├─ Composer Install
│   └─ Cache Clear
├── Frontend Deployment
│   ├─ npm run build
│   └─ Static Files Deploy
└── Monitoring & Verification

ROLLBACK
├── Database Backup
├── Code Rollback
└── Cache Refresh
```

---

## System Compatibility

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      COMPATIBILITY MATRIX                                │
└─────────────────────────────────────────────────────────────────────────┘

PHP Versions
├── 8.0 ✓
├── 8.1 ✓
├── 8.2 ✓
└── 8.3 ✓

Laravel Versions
├── 10.x ✓
├── 11.x ✓
└── 12.x (when released) ✓

Node.js Versions
├── 16.x ✓
├── 18.x ✓
├── 20.x ✓
└── 22.x ✓

Databases
├── MySQL 5.7 ✓
├── MySQL 8.0 ✓
├── MariaDB 10.4 ✓
└── PostgreSQL ✓

Browsers
├── Chrome/Chromium ✓
├── Firefox ✓
├── Safari ✓
├── Edge ✓
└── Opera ✓

Devices
├── Desktop ✓
├── Tablet ✓
├── Mobile ✓
└── Hybrid ✓
```

---

This visual guide helps understand the complete QR code system architecture,
data flow, and deployment process.
