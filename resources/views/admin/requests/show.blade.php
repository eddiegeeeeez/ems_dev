@extends('layouts.app')

@section('title', 'Request Details')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Booking Request #{{ $booking->id }}</h1>
            <p class="text-gray-600 mt-1">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    @if($booking->status === 'pending') bg-yellow-100 text-yellow-800
                    @elseif($booking->status === 'approved') bg-green-100 text-green-800
                    @elseif($booking->status === 'rejected') bg-red-100 text-red-800
                    @else bg-blue-100 text-blue-800
                    @endif">
                    {{ ucfirst($booking->status) }}
                </span>
            </p>
        </div>
        <a href="{{ route('admin.requests.index') }}" class="text-blue-600 hover:text-blue-900">← Back to List</a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
            <!-- User Information -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Name</p>
                        <p class="font-medium text-gray-900">{{ $booking->user->name }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Email</p>
                        <p class="font-medium text-gray-900">{{ $booking->user->email }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Phone</p>
                        <p class="font-medium text-gray-900">{{ $booking->user->phone ?? 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Department</p>
                        <p class="font-medium text-gray-900">{{ $booking->user->department->name ?? 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Booking Details -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Venue</p>
                        <p class="font-medium text-gray-900">{{ $booking->venue->name }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Start Date</p>
                        <p class="font-medium text-gray-900">{{ $booking->start_datetime->format('M d, Y H:i') }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">End Date</p>
                        <p class="font-medium text-gray-900">{{ $booking->end_datetime->format('M d, Y H:i') }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Duration</p>
                        <p class="font-medium text-gray-900">{{ $booking->duration_in_hours }} hours</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Purpose</p>
                        <p class="font-medium text-gray-900">{{ $booking->purpose ?? 'Not specified' }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Expected Attendees</p>
                        <p class="font-medium text-gray-900">{{ $booking->expected_attendees ?? 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Equipment -->
            @if($booking->equipment->isNotEmpty())
            <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Equipment Required</h2>
                <div class="space-y-3">
                    @foreach($booking->equipment as $eq)
                    <div class="flex justify-between items-center pb-3 border-b border-gray-200">
                        <div>
                            <p class="font-medium text-gray-900">{{ $eq->equipment->name }}</p>
                            <p class="text-sm text-gray-600">{{ $eq->quantity }} unit(s) requested</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Notes -->
            @if($booking->notes)
            <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                <p class="text-gray-700 whitespace-pre-wrap">{{ $booking->notes }}</p>
            </div>
            @endif
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
            <!-- Cost Summary -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h2>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Venue Rental</span>
                        <span class="font-medium">Php {{ number_format($booking->venue_cost, 2) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Equipment</span>
                        <span class="font-medium">Php {{ number_format($booking->equipment_cost, 2) }}</span>
                    </div>
                    <div class="pt-3 border-t border-gray-200 flex justify-between">
                        <span class="font-semibold">Total</span>
                        <span class="text-lg font-bold text-blue-600">Php {{ number_format($booking->total_cost, 2) }}</span>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            @if($booking->status === 'pending')
            <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                <form method="POST" action="{{ route('admin.requests.approve', $booking) }}">
                    @csrf
                    <input type="hidden" name="notes" value="Approved by admin">
                    <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium">
                        Approve Request
                    </button>
                </form>

                <button onclick="document.getElementById('rejectModal').classList.remove('hidden')" 
                        class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium">
                    Reject Request
                </button>
            </div>

            <!-- Reject Modal -->
            <div id="rejectModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Reject Request</h3>
                    <form method="POST" action="{{ route('admin.requests.reject', $booking) }}">
                        @csrf
                        @method('PATCH')
                        <textarea name="reason" class="w-full border border-gray-300 rounded-lg p-3 mb-4" 
                                  placeholder="Reason for rejection" required></textarea>
                        <div class="flex gap-3">
                            <button type="button" onclick="document.getElementById('rejectModal').classList.add('hidden')" 
                                    class="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400">
                                Cancel
                            </button>
                            <button type="submit" class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                                Reject
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            @endif

            <!-- Status Info -->
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                <div class="space-y-3 text-sm">
                    <div>
                        <p class="text-gray-600">Created</p>
                        <p class="font-medium">{{ $booking->created_at->format('M d, Y H:i') }}</p>
                    </div>
                    @if($booking->updated_at != $booking->created_at)
                    <div>
                        <p class="text-gray-600">Last Updated</p>
                        <p class="font-medium">{{ $booking->updated_at->format('M d, Y H:i') }}</p>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
