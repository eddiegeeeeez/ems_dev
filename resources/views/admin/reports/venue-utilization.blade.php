@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Venue Utilization Report</h1>
        <p class="text-gray-600 mt-1">Analyze venue usage patterns and capacity</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @forelse($venues ?? [] as $venue)
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900">{{ $venue->name }}</h3>
            <div class="mt-4 space-y-3">
                <div>
                    <p class="text-sm text-gray-600">Total Bookings</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $venue->bookings_count ?? 0 }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Utilization Rate</p>
                    <p class="text-2xl font-bold text-green-600">{{ $venue->utilization_rate ?? '0' }}%</p>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: {{ $venue->utilization_rate ?? 0 }}%"></div>
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
            <p class="text-gray-600">No venue data available</p>
        </div>
        @endforelse
    </div>
</div>
@endsection
