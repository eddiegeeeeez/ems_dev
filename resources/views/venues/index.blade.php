@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div>
  <div class="mb-6 md:mb-8">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Welcome, Maria</h1>
    <p class="text-sm md:text-base text-gray-600 mt-2">
      Manage your event bookings and venue reservations
    </p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="p-4 pb-3 border-b border-gray-100">
          <div class="text-xs md:text-sm font-medium text-gray-600">Total Bookings</div>
        </div>
        <div class="p-4 flex items-center justify-between">
          <div class="text-2xl md:text-3xl font-bold text-[#c41e3a]">12</div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 md:h-8 w-6 md:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="p-4 pb-3 border-b border-gray-100">
          <div class="text-xs md:text-sm font-medium text-gray-600">Pending Approval</div>
        </div>
        <div class="p-4 flex items-center justify-between">
          <div class="text-2xl md:text-3xl font-bold text-yellow-600">3</div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 md:h-8 w-6 md:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        <div class="p-4 pb-3 border-b border-gray-100">
          <div class="text-xs md:text-sm font-medium text-gray-600">Approved Events</div>
        </div>
        <div class="p-4 flex items-center justify-between">
          <div class="text-2xl md:text-3xl font-bold text-[#4caf50]">9</div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 md:h-8 w-6 md:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="bg-white rounded-lg shadow">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-gray-100">
        <div>
          <h2 class="text-lg md:text-xl font-semibold text-gray-900">Recent Bookings</h2>
          <p class="text-gray-500 text-sm">Your latest event reservations</p>
        </div>
        <button class="w-full sm:w-auto px-4 py-2 border rounded text-gray-700 bg-transparent hover:bg-gray-100 text-sm font-medium">
          View All
        </button>
      </div>

      <!-- Booking List -->
      <div class="p-4 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4 border-b pb-4">
          <div>
            <h3 class="font-medium text-gray-900 text-sm md:text-base">Student Workshop</h3>
            <p class="text-xs md:text-sm text-gray-600">Nov 20, 2025 at 2:00 PM</p>
          </div>
          <span class="bg-yellow-500 text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium">pending</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4 border-b pb-4">
          <div>
            <h3 class="font-medium text-gray-900 text-sm md:text-base">IT Department Seminar</h3>
            <p class="text-xs md:text-sm text-gray-600">Nov 15, 2025 at 9:00 AM</p>
          </div>
          <span class="bg-[#4caf50] text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium">approved</span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
          <div>
            <h3 class="font-medium text-gray-900 text-sm md:text-base">Faculty Orientation</h3>
            <p class="text-xs md:text-sm text-gray-600">Oct 25, 2025 at 10:00 AM</p>
          </div>
          <span class="bg-red-500 text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium">rejected</span>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection

