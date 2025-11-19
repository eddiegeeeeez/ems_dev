@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
        <p class="text-gray-600 mt-1">View and manage maintenance requests</p>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Venue</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($maintenance_requests ?? [] as $request)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ $request->venue->name ?? 'Unknown' }}</td>
                    <td class="px-6 py-4 text-sm"><span class="inline-flex px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">{{ $request->type }}</span></td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $request->description }}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="inline-flex px-2 py-1 rounded text-xs font-medium {{ $request->status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                            {{ $request->status }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $request->created_at->format('M d, Y') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">No maintenance requests</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
