@extends('layouts.app')

@section('title', 'Maintenance Requests')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p class="text-gray-600 mt-1">Track and manage venue maintenance</p>
        </div>
        <a href="{{ route('admin.maintenance.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            + New Request
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ $stats['total'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Pending</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">{{ $stats['pending'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">In Progress</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ $stats['in_progress'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ $stats['completed'] }}</p>
        </div>
    </div>

    <!-- Requests Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Venue</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @forelse($requests as $request)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-900">#{{ $request->id }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ $request->venue->name }}</td>
                        <td class="px-6 py-4 text-sm">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {{ ucfirst($request->type) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                {{ $request->priority === 'high' ? 'bg-red-100 text-red-800' : ($request->priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800') }}">
                                {{ ucfirst($request->priority) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                {{ $request->status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ($request->status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800') }}">
                                {{ ucfirst($request->status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ $request->assignedTo->name ?? 'Unassigned' }}</td>
                        <td class="px-6 py-4 text-sm space-x-2">
                            <button class="text-blue-600 hover:text-blue-900 font-medium" onclick="showUpdateModal({{ $request->id }})">Update</button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                            No maintenance requests found
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($requests->hasPages())
        <div class="bg-white px-6 py-4 border-t border-gray-200">
            {{ $requests->links() }}
        </div>
        @endif
    </div>
</div>

<script>
function showUpdateModal(requestId) {
    document.getElementById('updateModal').classList.remove('hidden');
    document.getElementById('requestId').value = requestId;
}
</script>

<!-- Update Status Modal -->
<div id="updateModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-semibold mb-4">Update Status</h3>
        <form method="POST" id="updateForm">
            @csrf
            @method('PATCH')
            <input type="hidden" id="requestId">
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" class="w-full border border-gray-300 rounded-lg p-2" required>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea name="notes" class="w-full border border-gray-300 rounded-lg p-2" rows="3"></textarea>
            </div>

            <div class="flex gap-3">
                <button type="button" onclick="document.getElementById('updateModal').classList.add('hidden')" 
                        class="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Update
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
