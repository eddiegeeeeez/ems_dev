# Script to set up the React frontend with Laravel backend

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Laravel + React Integration Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\Acer NITRO 5 -__-\Downloads\it9 ni edgardough\ems_dev"
$reactSource = "C:\Users\Acer NITRO 5 -__-\Downloads\university-event-system"
$frontendDest = Join-Path $projectRoot "frontend"

# Step 1: Copy React project
Write-Host "Step 1: Copying React project..." -ForegroundColor Yellow
if (Test-Path $reactSource) {
    if (Test-Path $frontendDest) {
        Write-Host "Frontend folder already exists. Skipping copy..." -ForegroundColor Gray
    } else {
        Copy-Item -Path $reactSource -Destination $frontendDest -Recurse
        Write-Host "✓ React project copied to frontend/" -ForegroundColor Green
    }
} else {
    Write-Host "✗ React source not found at: $reactSource" -ForegroundColor Red
    exit 1
}

# Step 2: Create .env.local for Next.js
Write-Host "`nStep 2: Creating frontend .env.local..." -ForegroundColor Yellow
$envContent = "NEXT_PUBLIC_API_URL=http://localhost:8000/api`nNEXT_PUBLIC_APP_URL=http://localhost:8000"

$envPath = Join-Path $frontendDest ".env.local"
if (Test-Path $envPath) {
    Write-Host ".env.local already exists. Skipping..." -ForegroundColor Gray
} else {
    Set-Content -Path $envPath -Value $envContent
    Write-Host "Created .env.local" -ForegroundColor Green
}

# Step 3: Install npm dependencies
Write-Host "`nStep 3: Installing npm dependencies..." -ForegroundColor Yellow
Set-Location $frontendDest
if (Test-Path "node_modules") {
    Write-Host "node_modules already exists. Skipping install..." -ForegroundColor Gray
} else {
    Write-Host "Running npm install (this may take a few minutes)..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    }
}

# Step 4: Create API client
Write-Host "`nStep 4: Creating API client utility..." -ForegroundColor Yellow
$libPath = Join-Path $frontendDest "lib"
$apiClientPath = Join-Path $libPath "api.ts"

$apiClientContent = @'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async getUser() {
    return this.fetch('/auth/user');
  }

  async logout() {
    return this.fetch('/auth/logout', { method: 'POST' });
  }

  async loginWithGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`;
  }

  // Dashboard
  async getDashboard() {
    return this.fetch('/dashboard');
  }

  async getAdminDashboard() {
    return this.fetch('/admin/dashboard');
  }

  // Venues
  async getVenues() {
    return this.fetch('/venues');
  }

  async getVenue(id: string) {
    return this.fetch(`/venues/${id}`);
  }

  async createVenue(data: any) {
    return this.fetch('/admin/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVenue(id: string, data: any) {
    return this.fetch(`/admin/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVenue(id: string) {
    return this.fetch(`/admin/venues/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleVenueActive(id: string) {
    return this.fetch(`/admin/venues/${id}/toggle-active`, {
      method: 'POST',
    });
  }

  // Bookings
  async getBookings() {
    return this.fetch('/bookings');
  }

  async getBooking(id: string) {
    return this.fetch(`/bookings/${id}`);
  }

  async createBooking(data: any) {
    return this.fetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: string, data: any) {
    return this.fetch(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: string) {
    return this.fetch(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Booking Requests
  async getBookingRequests() {
    return this.fetch('/admin/requests');
  }

  async approveBooking(id: string) {
    return this.fetch(`/admin/requests/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectBooking(id: string, reason?: string) {
    return this.fetch(`/admin/requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Equipment
  async getEquipment() {
    return this.fetch('/admin/equipment');
  }

  async createEquipment(data: any) {
    return this.fetch('/admin/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(id: string, data: any) {
    return this.fetch(`/admin/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEquipment(id: string) {
    return this.fetch(`/admin/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  // Maintenance
  async getMaintenanceRequests() {
    return this.fetch('/admin/maintenance/requests');
  }

  async createMaintenanceRequest(data: any) {
    return this.fetch('/admin/maintenance/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenanceStatus(id: string, status: string) {
    return this.fetch(`/admin/maintenance/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Users
  async getUsers() {
    return this.fetch('/admin/users');
  }

  async getUser(id: string) {
    return this.fetch(`/admin/users/${id}`);
  }

  async updateUserRole(id: string, role: string) {
    return this.fetch(`/admin/users/${id}/role`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  async deactivateUser(id: string) {
    return this.fetch(`/admin/users/${id}/deactivate`, {
      method: 'POST',
    });
  }

  async activateUser(id: string) {
    return this.fetch(`/admin/users/${id}/activate`, {
      method: 'POST',
    });
  }

  // Departments
  async getDepartments() {
    return this.fetch('/admin/departments');
  }

  async createDepartment(data: any) {
    return this.fetch('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: string, data: any) {
    return this.fetch(`/admin/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id: string) {
    return this.fetch(`/admin/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications() {
    return this.fetch('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.fetch(`/notifications/${id}/mark-read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead() {
    return this.fetch('/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  async deleteNotification(id: string) {
    return this.fetch(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports
  async getVenueUtilization() {
    return this.fetch('/admin/reports/venue-utilization');
  }

  async getBookingStatistics() {
    return this.fetch('/admin/reports/booking-statistics');
  }

  // Calendar
  async getCalendarEvents() {
    return this.fetch('/admin/calendar/events');
  }

  // Audit Logs
  async getAuditLogs() {
    return this.fetch('/admin/audit-logs');
  }

  async searchAuditLogs(query: string) {
    return this.fetch(`/admin/audit-logs/search?q=${encodeURIComponent(query)}`);
  }
}

export const apiClient = new ApiClient(API_URL);
'@

if (Test-Path $apiClientPath) {
    Write-Host "api.ts already exists. Skipping..." -ForegroundColor Gray
} else {
    Set-Content -Path $apiClientPath -Value $apiClientContent
    Write-Host "✓ Created lib/api.ts" -ForegroundColor Green
}

# Return to project root
Set-Location $projectRoot

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start Laravel backend:" -ForegroundColor White
Write-Host "   php artisan serve" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In a new terminal, start Next.js frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open your browser:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Backend API: http://localhost:8000/api" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Read INTEGRATION_GUIDE.md for more details" -ForegroundColor White
Write-Host ""
