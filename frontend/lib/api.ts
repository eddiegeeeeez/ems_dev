const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');
const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`[ApiClient] Fetching: ${url}`, options);

    // Attempt to get CSRF token from cookies
    let xsrfToken = '';
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
      if (match) {
        xsrfToken = decodeURIComponent(match[2]);
      }
    }

    const isFormData = options.body instanceof FormData;

    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      },
    };

    try {
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
    } catch (error) {
      console.error(`[ApiClient] Request failed: ${url}`, error);
      // Temporary: alert the user to debug "Failed to fetch"
      if ((error as Error).message === 'Failed to fetch') {
        alert(`Network Error: Failed to reach ${url}. Check if backend is running.`);
      }
      throw error;
    }
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
    const isFormData = data instanceof FormData;
    return this.fetch('/bookings', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
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

  // Users
  async getUsers() {
    return this.fetch('/admin/users');
  }

  async getUserDetails(id: string) {
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
  // Settings
  async getBookingRules() {
    return this.fetch('/admin/settings/booking-rules');
  }

  async updateBookingRules(data: any) {
    return this.fetch('/admin/settings/booking-rules', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getGeneralSettings() {
    return this.fetch('/admin/settings/general');
  }

  async updateGeneralSettings(data: any) {
    return this.fetch('/admin/settings/general', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async checkEquipmentAvailability(start: string, end: string) {
    return this.fetch(`/equipment/availability?start_datetime=${encodeURIComponent(start)}&end_datetime=${encodeURIComponent(end)}`);
  }
}

export const apiClient = new ApiClient(baseURL);
