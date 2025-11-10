{{-- This file extends the main layout --}}
@extends('layouts.app')

{{-- Set the title for this page --}}
@section('title', 'My Dashboard - EMS')

{{-- This is the content that will be injected into the layout --}}
@section('content')

<div>
    <h1 class="text-3xl font-bold text-gray-900">Welcome, Edgar</h1>
    <p class="mt-1 text-base text-gray-600">Manage your event bookings and venue reservations</p>
</div>

<div class="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
    <div class="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <span class="text-sm font-medium text-gray-500">Total Bookings</span>
            <p class="text-4xl font-bold text-red-600 mt-2">2</p>
        </div>
        <div class="p-3 bg-gray-100 rounded-full">
            <span class="w-8 h-8 text-gray-400">
                <img src="{{ asset('icons/calendar-days.svg') }}" alt="Total Bookings" class="w-full h-full">
            </span>
        </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <span class="text-sm font-medium text-gray-500">Pending Approval</span>
            <p class="text-4xl font-bold text-yellow-500 mt-2">1</p>
        </div>
        <div class="p-3 bg-gray-100 rounded-full">
            <span class="w-8 h-8 text-gray-400">
                <img src="{{ asset('icons/clock.svg') }}" alt="Pending Approval" class="w-full h-full">
            </span>
        </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <span class="text-sm font-medium text-gray-500">Approved Events</span>
            <p class="text-4xl font-bold text-green-600 mt-2">1</p>
        </div>
        <div class="p-3 bg-gray-100 rounded-full">
            <span class="w-8 h-8 text-gray-400">
                <img src="{{ asset('icons/check-circle-2.svg') }}" alt="Approved Events" class="w-full h-full">
            </span>
        </div>
    </div>
</div>

<div class="mt-10 bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
        <div>
            <h2 class="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <p class="text-sm text-gray-500 mt-1">Your latest event reservations</p>
        </div>
        <a href="#" class="text-sm font-medium text-red-600 hover:text-red-800">
            View All
        </a>
    </div>
    
    <div class="divide-y divide-gray-200">
        <div class="flex items-center justify-between p-5 hover:bg-gray-50">
            <div>
                <p class="font-medium text-gray-900">IT Department Seminar</p>
                <p class="text-sm text-gray-500 mt-1">11/15/2025 at 09:00</p>
            </div>
            <span class="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                approved
            </span>
        </div>
        <div class="flex items-center justify-between p-5 hover:bg-gray-50">
            <div>
                <p class="font-medium text-gray-900">Student Workshop</p>
                <p class="text-sm text-gray-500 mt-1">11/20/2025 at 14:00</p>
            </div>
            <span class="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                pending
            </span>
        </div>
    </div>
</div>

@endsection