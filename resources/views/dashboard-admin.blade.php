@extends('layouts.app')

@section('title', 'Admin Dashboard')

@section('content')

@php
$roleColors = [
    'ADMIN' => '#c41e3a',
    'ORGANIZER' => '#4caf50',
    'USER' => '#4caf50', // Legacy support
];
$role = $user->role ?? 'ADMIN';
$roleBgColor = $roleColors[$role] ?? '#c41e3a';
@endphp


<div class="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200/80">
    <!-- Header background -->
    <div class="h-32 md:h-28 w-full bg-cover bg-center relative" 
         style="background-image: url('https://picsum.photos/1200/200?grayscale&blur=1')">
        <div class="absolute inset-0 bg-gradient-to-r from-red-800 via-red-900 to-black opacity-80"></div>
    </div>

    <!-- Profile Avatar -->
    <div class="absolute -top-10 left-4 sm:left-6">
        <img src="{{ $user->avatar ?? '' }}" 
             alt="{{ $user->name }}" 
             class="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white shadow-lg object-cover">
    </div>

    <!-- User Details -->
    <div class="ml-0 pt-12 md:ml-[110px] md:pt-4">
        <div class="flex items-baseline space-x-3 flex-wrap">
            <h2 class="text-lg md:text-xl font-bold text-gray-800">{{ $user->name }}</h2>
            <span class="inline-block text-xs font-semibold text-white px-3 py-1 rounded-md uppercase tracking-wide mt-1 sm:mt-0" 
                  style="background-color: {{ $roleBgColor }}">
                {{ $user->role }}
            </span>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-1 uppercase">{{ $user->department }}</p>
    </div>
</div>

<div class="space-y-6 font-sans">
    {{-- User Profile Banner Component --}}
    @include('components.user_profile_banner', compact('user'))

    {{-- Admin Key Metrics Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">

        {{-- Pending Requests Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Requests</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-yellow-600">{{ $pendingRequests ?? 15 }}</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>

        {{-- Total Venues Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Venues</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-[#c41e3a]">{{ $totalVenues ?? 8 }}</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
        </div>

        {{-- Active Bookings Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Bookings</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-[#4caf50]">{{ $activeBookings ?? 42 }}</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>

        {{-- Total Users Card --}}
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div class="p-4 pb-3 border-b border-gray-100">
                <div class="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Users</div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="text-3xl font-extrabold text-blue-600">{{ $totalUsers ?? 156 }}</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Pending Requests Table -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
            <div>
                <h2 class="text-xl font-bold text-gray-900">Pending Approval Requests</h2>
                <p class="text-gray-500 text-sm">Venue booking requests awaiting your review</p>
            </div>
            <a href="#" class="w-full sm:w-auto px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg hover:bg-[#a01a2e] text-sm font-medium transition duration-150 ease-in-out">
                View All Requests
            </a>
        </div>

        <!-- Request List -->
        <div class="p-5 divide-y divide-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 py-4 first:pt-0">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 text-base">Student Workshop - Convention Center</h3>
                    <p class="text-xs md:text-sm text-gray-600">Requested by: John Doe • Nov 20, 2025 at 2:00 PM</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium uppercase">pending</span>
                    <button class="px-3 py-1 text-xs font-medium text-[#c41e3a] hover:bg-red-50 rounded">Review</button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 py-4">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 text-base">IT Department Seminar - Academic Hall</h3>
                    <p class="text-xs md:text-sm text-gray-600">Requested by: Jane Smith • Nov 18, 2025 at 10:00 AM</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium uppercase">pending</span>
                    <button class="px-3 py-1 text-xs font-medium text-[#c41e3a] hover:bg-red-50 rounded">Review</button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 py-4 last:pb-0">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 text-base">Sports Event - Sports Complex</h3>
                    <p class="text-xs md:text-sm text-gray-600">Requested by: Mike Johnson • Nov 15, 2025 at 3:00 PM</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium uppercase">pending</span>
                    <button class="px-3 py-1 text-xs font-medium text-[#c41e3a] hover:bg-red-50 rounded">Review</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="#" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Venue Calendar</h3>
                    <p class="text-sm text-gray-500">View all bookings</p>
                </div>
            </div>
        </a>

        <a href="#" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Reports & Analytics</h3>
                    <p class="text-sm text-gray-500">View system reports</p>
                </div>
            </div>
        </a>

        <a href="#" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Manage Venues</h3>
                    <p class="text-sm text-gray-500">Add or edit venues</p>
                </div>
            </div>
        </a>
    </div>
</div>
@endsection

