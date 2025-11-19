@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Booking Requests</h1>
        <p class="text-gray-600 mt-1">Review and manage event booking requests</p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-4 border-b border-gray-200">
        <button class="filter-tab py-3 px-4 border-b-2 border-[#c41e3a] text-[#c41e3a] font-medium" data-filter="pending">
            Pending
            <span class="ml-2 inline-block px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">{{ $pending_count ?? 0 }}</span>
        </button>
        <button class="filter-tab py-3 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium" data-filter="approved">
            Approved
            <span class="ml-2 inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">{{ $approved_count ?? 0 }}</span>
        </button>
        <button class="filter-tab py-3 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium" data-filter="rejected">
            Rejected
            <span class="ml-2 inline-block px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">{{ $rejected_count ?? 0 }}</span>
        </button>
    </div>

    <!-- Requests Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Organizer</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Venue</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($bookings ?? [] as $booking)
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm text-gray-900">
                        <div>
                            <p class="font-medium">{{ $booking->user->name ?? 'Unknown' }}</p>
                            <p class="text-gray-600">{{ $booking->user->email ?? '' }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                        <p class="font-medium">{{ $booking->venue->name ?? 'Unknown Venue' }}</p>
                        <p class="text-gray-600">{{ $booking->venue->location ?? '' }}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                        <div>
                            <p>{{ \Carbon\Carbon::parse($booking->date)->format('M d, Y') }}</p>
                            <p class="text-gray-600">{{ \Carbon\Carbon::parse($booking->start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($booking->end_time)->format('H:i') }}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        @if($booking->status === 'pending')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Pending</span>
                        @elseif($booking->status === 'approved')
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Approved</span>
                        @else
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Rejected</span>
                        @endif
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <button class="text-[#c41e3a] hover:text-[#a01830] font-medium mr-3 details-btn" data-booking-id="{{ $booking->id }}">
                            View
                        </button>
                        @if($booking->status === 'pending')
                        <form method="POST" action="{{ route('admin.requests.approve', $booking->id) }}" class="inline">
                            @csrf
                            <button type="submit" class="text-green-600 hover:text-green-700 font-medium">Approve</button>
                        </form>
                        <form method="POST" action="{{ route('admin.requests.reject', $booking->id) }}" class="inline">
                            @csrf
                            <button type="submit" class="text-red-600 hover:text-red-700 font-medium ml-3">Reject</button>
                        </form>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        No bookings found
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Booking Details Modal -->
    <div id="detailsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-xl font-bold text-gray-900">Booking Details</h2>
                <button type="button" class="text-gray-400 hover:text-gray-600" id="closeModal">
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6 space-y-4" id="modalContent">
                <!-- Content populated by JavaScript -->
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Filter tab switching
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active tab styling
                filterTabs.forEach(t => {
                    t.classList.remove('border-[#c41e3a]', 'text-[#c41e3a]');
                    t.classList.add('border-transparent', 'text-gray-600');
                });
                this.classList.remove('border-transparent', 'text-gray-600');
                this.classList.add('border-[#c41e3a]', 'text-[#c41e3a]');

                // Filter table rows
                const rows = document.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    // In a real implementation, you'd filter based on data attributes
                    // For now, this is a placeholder
                });
            });
        });

        // Details button functionality
        const detailsButtons = document.querySelectorAll('.details-btn');
        const detailsModal = document.getElementById('detailsModal');
        const closeModal = document.getElementById('closeModal');
        const modalContent = document.getElementById('modalContent');

        detailsButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const bookingId = this.getAttribute('data-booking-id');
                
                // Fetch booking details (in a real app, use fetch API)
                const row = this.closest('tr');
                const organizer = row.cells[0].textContent;
                const venue = row.cells[1].textContent;
                const date = row.cells[2].textContent;
                const status = row.cells[3].textContent;

                modalContent.innerHTML = `
                    <div class="space-y-4">
                        <div>
                            <p class="text-sm text-gray-600">Organizer</p>
                            <p class="text-lg font-medium text-gray-900">${organizer}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Venue</p>
                            <p class="text-lg font-medium text-gray-900">${venue}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Date & Time</p>
                            <p class="text-lg font-medium text-gray-900">${date}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Status</p>
                            <p class="text-lg font-medium text-gray-900">${status}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Description</p>
                            <p class="text-gray-900">Event description and notes would appear here</p>
                        </div>
                    </div>
                `;

                detailsModal.classList.remove('hidden');
            });
        });

        closeModal.addEventListener('click', function() {
            detailsModal.classList.add('hidden');
        });

        detailsModal.addEventListener('click', function(e) {
            if (e.target === detailsModal) {
                detailsModal.classList.add('hidden');
            }
        });
    });
</script>
@endsection
