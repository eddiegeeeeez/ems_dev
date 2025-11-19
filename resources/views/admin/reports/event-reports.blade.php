@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Event Reports</h1>
            <p class="text-gray-600 mt-1">Booking statistics and trends</p>
        </div>
        <a href="{{ route('admin.reports.export') }}" class="px-6 py-2 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830]">
            Export Report
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-gray-600 text-sm font-medium">Total Bookings</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ $total_bookings ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-gray-600 text-sm font-medium">Approved Rate</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ $approval_rate ?? 0 }}%</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-gray-600 text-sm font-medium">Avg Attendees</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ $avg_attendees ?? 0 }}</p>
        </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Monthly Booking Trend</h2>
        <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p class="text-gray-600">Chart visualization would appear here</p>
        </div>
    </div>
</div>
@endsection
