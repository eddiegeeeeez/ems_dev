@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div>
        <h1 class="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p class="text-gray-600 mt-1">System activity and change history</p>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entity</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($logs ?? [] as $log)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ $log->user->name ?? 'System' }}</td>
                    <td class="px-6 py-4 text-sm"><span class="inline-flex px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">{{ $log->action }}</span></td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $log->entity_type }} #{{ $log->entity_id }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $log->created_at->diffForHumans() }}</td>
                </tr>
                @empty\n                <tr>\n                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">No audit logs</td>\n                </tr>\n                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
