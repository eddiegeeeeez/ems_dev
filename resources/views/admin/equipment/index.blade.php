@extends('admin.layout')

@section('title', 'Equipment')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Equipment</h1>
            <p class="text-gray-600 mt-1">Manage venue equipment inventory</p>
        </div>
        <a href="{{ route('admin.equipment.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            + Add Equipment
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Total Equipment</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ $stats['total'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Low Stock</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ $stats['low_stock'] }}</p>
        </div>
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <p class="text-sm text-gray-600">Venues</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ $stats['venues'] }}</p>
        </div>
    </div>

    <!-- Equipment Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Venue</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @forelse($equipment as $item)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ $item->name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ $item->venue->name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">{{ $item->category ?? 'General' }}</td>
                        <td class="px-6 py-4 text-sm">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                {{ $item->quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' }}">
                                {{ $item->quantity }} units
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            @if($item->quantity < 5)
                                <span class="text-red-600 font-medium">⚠️ Low Stock</span>
                            @else
                                <span class="text-green-600 font-medium">✓ In Stock</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-sm space-x-3 flex">
                            <a href="{{ route('admin.equipment.show', $item) }}" class="text-blue-600 hover:text-blue-900 font-medium">View</a>
                            <a href="{{ route('admin.equipment.edit', $item) }}" class="text-blue-600 hover:text-blue-900 font-medium">Edit</a>
                            <form method="POST" action="{{ route('admin.equipment.destroy', $item) }}" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-900 font-medium" onclick="return confirm('Delete this equipment?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                            No equipment found
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($equipment->hasPages())
        <div class="bg-white px-6 py-4 border-t border-gray-200">
            {{ $equipment->links() }}
        </div>
        @endif
    </div>
</div>
@endsection
