@extends('layouts.app')

@section('title', 'Booking Requests')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Booking Requests</h1>
            <p class="text-gray-600 mt-1">Manage all incoming booking requests</p>
        </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Pending Requests</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ $stats['pending'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Approved</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ $stats['approved'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Rejected</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ $stats['rejected'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ $stats['completed'] }}</p>
        </div>
    </div>

    <!-- Requests Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Venue</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @forelse($bookings as $booking)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-900">#{{ $booking->id }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ $booking->user->name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ $booking->venue->name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">
                            {{ $booking->start_datetime->format('M d, Y') }}
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                @if($booking->status === 'pending') bg-yellow-100 text-yellow-800
                                @elseif($booking->status === 'approved') bg-green-100 text-green-800
                                @elseif($booking->status === 'rejected') bg-red-100 text-red-800
                                @elseif($booking->status === 'completed') bg-blue-100 text-blue-800
                                @else bg-gray-100 text-gray-800
                                @endif">
                                {{ ucfirst($booking->status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900">Php {{ number_format($booking->total_cost, 2) }}</td>
                        <td class="px-6 py-4 text-sm space-x-2 flex">
                            <a href="{{ route('admin.requests.show', $booking) }}" 
                               class="text-blue-600 hover:text-blue-900 font-medium">View</a>
                            @if($booking->status === 'pending')
                            <form method="POST" action="{{ route('admin.requests.approve', $booking) }}" class="inline">
                                @csrf
                                <button type="submit" class="text-green-600 hover:text-green-900 font-medium">Approve</button>
                            </form>
                            <form method="POST" action="{{ route('admin.requests.reject', $booking) }}" class="inline">
                                @csrf
                                @method('PATCH')
                                <input type="hidden" name="reason" value="Declined by admin">
                                <button type="submit" class="text-red-600 hover:text-red-900 font-medium">Reject</button>
                            </form>
                            @endif
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                            No booking requests found
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($bookings->hasPages())
        <div class="bg-white px-6 py-4 border-t border-gray-200">
            {{ $bookings->links() }}
        </div>
        @endif
    </div>
</div>
@endsection
