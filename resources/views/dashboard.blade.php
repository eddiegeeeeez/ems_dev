@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="space-y-6 font-sans">
    
    @php
        // Define the $user object with fixed dummy data
        $user = (object)[
            'name' => 'MARIA DELA CRUZ', 
            'role' => 'ORGANIZER', 
            'department' => 'EVENT MANAGEMENT OFFICE'
        ];
    @endphp

    {{-- User Profile Banner Component --}}
    @include('components.user_profile_banner', compact('user'))
    
    {{-- Key Metrics Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        
        {{-- Total Bookings Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-[#c41e3a]">12</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </div>
        </div>

        {{-- Pending Approval Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Approval</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-yellow-600">3</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
        </div>

        {{-- Approved Events Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Approved Events</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-[#4caf50]">9</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
        </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
            <div>
                <h2 class="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <p class="text-gray-500 text-sm">Your latest event reservations</p>
            </div>
            <button class="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-transparent hover:bg-gray-50 text-sm font-medium transition duration-150 ease-in-out">
                View All
            </button>
        </div>

        <!-- Booking List -->
        <div class="p-5 divide-y divide-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 py-4 first:pt-0">
                <div>
                    <h3 class="font-semibold text-gray-900 text-base">Student Workshop</h3>
                    <p class="text-xs md:text-sm text-gray-600">Nov 20, 2025 at 2:00 PM</p>
                </div>
                <span class="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium uppercase">pending</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 py-4">
                <div>
                    <h3 class="font-semibold text-gray-900 text-base">IT Department Seminar</h3>
                    <p class="text-xs md:text-sm text-gray-600">Nov 15, 2025 at 9:00 AM</p>
                </div>
                <span class="bg-green-100 text-[#4caf50] text-xs px-3 py-1 rounded-full font-medium uppercase">approved</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 py-4 last:pb-0">
                <div>
                    <h3 class="font-semibold text-gray-900 text-base">Faculty Orientation</h3>
                    <p class="text-xs md:text-sm text-gray-600">Oct 25, 2025 at 10:00 AM</p>
                </div>
                <span class="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium uppercase">rejected</span>
            </div>
        </div>
    </div>
</div>
@endsection