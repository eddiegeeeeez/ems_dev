@extends('layouts.app')

@section('title', 'Organizer Dashboard')

@section('content')

<div class="space-y-6 font-sans">
    @include('components.user_profile_banner', ['user' => $user, 'role' => 'ORGANIZER'])

    {{-- Stats Cards - Responsive Grid --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {{-- Total Bookings Card --}}
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div class="pt-4 pb-3 px-4">
                <div class="text-xs md:text-sm font-medium text-gray-600">Total Bookings</div>
            </div>
            <div class="px-4 pb-4">
                <div class="flex flex-row-reverse items-center justify-between">
                    <div class="text-2xl md:text-3xl font-bold text-[#c41e3a]">{{ $totalBookings ?? 0 }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 md:h-8 w-6 md:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        </div>

        {{-- Pending Approval Card --}}
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div class="pt-4 pb-3 px-4">
                <div class="text-xs md:text-sm font-medium text-gray-600">Pending Approval</div>
            </div>
            <div class="px-4 pb-4">
                <div class="flex flex-row-reverse items-center justify-between">
                    <div class="text-2xl md:text-3xl font-bold text-yellow-600">{{ $pendingBookings ?? 0 }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 md:h-8 w-6 md:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>

        {{-- Approved Events Card --}}
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div class="pt-4 pb-3 px-4">
                <div class="text-xs md:text-sm font-medium text-gray-600">Approved Events</div>
            </div>
            <div class="px-4 pb-4">
                <div class="flex flex-row-reverse items-center justify-between">
                    <div class="text-2xl md:text-3xl font-bold text-[#4caf50]">{{ $approvedBookings ?? 0 }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 md:h-8 w-6 md:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    {{-- Quick Actions --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {{-- Browse Venues Card --}}
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div class="p-4 md:p-6">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900">Browse Venues</h3>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">Find available venues</p>
                <a href="{{ route('venues.index') }}" class="inline-block w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded text-center transition">
                    View Venues
                </a>
            </div>
        </div>

        {{-- My Bookings Card --}}
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div class="p-4 md:p-6">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900">My Bookings</h3>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">View all your bookings</p>
                <a href="{{ route('bookings.index') }}" class="inline-block w-full mt-4 px-4 py-2 bg-[#4caf50] hover:bg-[#45a049] text-white text-xs sm:text-sm font-medium rounded text-center transition">
                    View Bookings
                </a>
            </div>
        </div>

        {{-- My Feedback Card --}}
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div class="p-4 md:p-6">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900">My Feedback</h3>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">View feedback & reviews</p>
                <a href="{{ route('feedback.index') }}" class="inline-block w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium rounded text-center transition">
                    View Feedback
                </a>
            </div>
        </div>
    </div>

    {{-- Recent Bookings --}}
    <div class="bg-white rounded-lg shadow border border-gray-200">
        <div class="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
            <h2 class="text-lg md:text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <p class="text-xs md:text-sm text-gray-600 mt-1">Your latest event reservations</p>
        </div>
        <div class="px-4 md:px-6 py-4 md:py-5 space-y-3 sm:space-y-4">
            @forelse($bookings ?? [] as $booking)
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-medium text-gray-900 text-sm md:text-base truncate">{{ $booking->event_title ?? 'Event Title' }}</h3>
                        <p class="text-xs md:text-sm text-gray-600">
                            {{ \Carbon\Carbon::parse($booking->start_date ?? now())->toFormattedDateString() }} at {{ $booking->start_time ?? '00:00' }}
                        </p>
                    </div>
                    <span class="whitespace-nowrap text-xs md:text-sm font-medium px-3 py-1 rounded-full
                        @if(($booking->status ?? '') === 'approved')
                            bg-[#4caf50] text-white
                        @elseif(($booking->status ?? '') === 'pending')
                            bg-yellow-500 text-white
                        @elseif(($booking->status ?? '') === 'rejected')
                            bg-red-500 text-white
                        @else
                            bg-gray-400 text-white
                        @endif
                    ">
                        {{ $booking->status ?? 'pending' }}
                    </span>
                </div>
            @empty
                <p class="text-center text-gray-500 py-8">No recent bookings</p>
            @endforelse
        </div>
    </div>
</div>
@endsection
