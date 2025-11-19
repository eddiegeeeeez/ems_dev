@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Scheduled Maintenance</h1>
        <p class="text-gray-600 mt-1">Planned maintenance schedules for venues</p>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Venue</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($scheduled_maintenance ?? [] as $schedule)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ $schedule->venue->name ?? 'Unknown' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $schedule->start_date->format('M d, Y') }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $schedule->start_date->diffInDays($schedule->end_date) }} days</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="inline-flex px-2 py-1 rounded text-xs font-medium {{ $schedule->status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800' }}">
                            {{ $schedule->status }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">No scheduled maintenance</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
