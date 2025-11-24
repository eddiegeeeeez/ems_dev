@extends('admin.layout')

@section('title', 'Venues')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Venues</h1>
            <p class="text-gray-600 mt-1">Manage all event venues</p>
        </div>
        <a href="{{ route('admin.venues.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            + Add Venue
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Total Venues</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ $stats['total'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Active</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ $stats['active'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Inactive</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ $stats['inactive'] }}</p>
        </div>
    </div>

    <!-- Venues Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($venues as $venue)
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-semibold text-gray-900">{{ $venue->name }}</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        {{ $venue->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                        {{ $venue->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </div>
                
                <p class="text-sm text-gray-600 mb-3">{{ $venue->department->name }}</p>
                <p class="text-sm text-gray-700 mb-4 line-clamp-2">{{ $venue->description }}</p>

                <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                        <p class="text-gray-600">Capacity</p>
                        <p class="font-medium text-gray-900">{{ $venue->capacity }} people</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Rate/Hour</p>
                        <p class="font-medium text-gray-900">Php {{ number_format($venue->hourly_rate, 2) }}</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Bookings</p>
                        <p class="font-medium text-gray-900">{{ $venue->bookings_count }}</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Equipment</p>
                        <p class="font-medium text-gray-900">{{ $venue->equipment_count }}</p>
                    </div>
                </div>

                <div class="flex gap-2">
                    <a href="{{ route('admin.venues.show', $venue) }}" class="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium">View</a>
                    <a href="{{ route('admin.venues.edit', $venue) }}" class="flex-1 text-center bg-gray-50 text-gray-700 py-2 rounded hover:bg-gray-100 text-sm font-medium">Edit</a>
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full text-center py-12 text-gray-500">
            No venues found
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    @if($venues->hasPages())
    <div class="flex justify-center">
        {{ $venues->links() }}
    </div>
    @endif
</div>
@endsection
