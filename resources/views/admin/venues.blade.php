@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Venues Management</h1>
            <p class="text-gray-600 mt-1">Manage all available venues</p>
        </div>
        <a href="{{ route('admin.venues.create') }}" class="px-6 py-2 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830]">
            Add Venue
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($venues ?? [] as $venue)
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-300"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ $venue->name }}</h3>
                <p class="text-gray-600 text-sm mt-1">{{ $venue->location }}</p>
                <p class="text-gray-600 text-sm mt-2">Capacity: {{ $venue->capacity ?? 'N/A' }} people</p>
                <div class="mt-4 flex space-x-2">
                    <a href="{{ route('admin.venues.edit', $venue->id) }}" class="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium text-center hover:bg-blue-200">
                        Edit
                    </a>
                    <form method="POST" action="{{ route('admin.venues.toggle', $venue->id) }}" class="flex-1">
                        @csrf
                        <button type="submit" class="w-full px-3 py-2 {{ $venue->active ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700' }} rounded text-sm font-medium hover:opacity-80">
                            {{ $venue->active ? 'Deactivate' : 'Activate' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
            <p class="text-gray-600 mb-4">No venues found</p>
            <a href="{{ route('admin.venues.create') }}" class="px-6 py-2 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830] inline-block">
                Create First Venue
            </a>
        </div>
        @endforelse
    </div>
</div>
@endsection
