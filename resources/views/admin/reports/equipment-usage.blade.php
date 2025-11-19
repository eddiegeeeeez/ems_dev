@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Equipment Usage Report</h1>
        <p class="text-gray-600 mt-1">Track equipment usage across bookings</p>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Equipment</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Used</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Available</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Usage Rate</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($equipment ?? [] as $eq)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ $eq->name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $eq->times_used ?? 0 }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $eq->available ?? 0 }}</td>
                    <td class="px-6 py-4 text-sm">
                        <div class="flex items-center">
                            <div class="w-24 bg-gray-200 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $eq->usage_rate ?? 0 }}%"></div>
                            </div>
                            <span class="ml-2 text-xs text-gray-600">{{ $eq->usage_rate ?? 0 }}%</span>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">No equipment data</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
