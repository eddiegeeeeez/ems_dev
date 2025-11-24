@props(['badge' => '', 'status' => 'pending'])

@php
$badgeVariants = [
    'pending' => 'bg-yellow-100 text-yellow-800',
    'approved' => 'bg-green-100 text-green-800',
    'rejected' => 'bg-red-100 text-red-800',
    'completed' => 'bg-blue-100 text-blue-800',
    'cancelled' => 'bg-gray-100 text-gray-800',
    'open' => 'bg-yellow-100 text-yellow-800',
    'in_progress' => 'bg-blue-100 text-blue-800',
    'resolved' => 'bg-green-100 text-green-800',
    'closed' => 'bg-gray-100 text-gray-800',
];

$badgeClass = $badgeVariants[$status] ?? 'bg-gray-100 text-gray-800';
@endphp

<span @class(['px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block uppercase', $badgeClass])>
    {{ $badge ?: ucfirst(str_replace('_', ' ', $status)) }}
</span>
