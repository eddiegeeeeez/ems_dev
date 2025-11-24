@props(['headers' => [], 'rows' => [], 'actions' => null])

<div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
            <tr>
                @foreach($headers as $header)
                    <th class="px-6 py-3 text-sm font-semibold text-gray-700">
                        {{ $header }}
                    </th>
                @endforeach
                @if($actions)
                    <th class="px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    @foreach($headers as $index => $header)
                        <td class="px-6 py-4 text-sm text-gray-700">
                            {{ $row[$index] ?? '-' }}
                        </td>
                    @endforeach
                    @if($actions)
                        <td class="px-6 py-4 text-sm space-x-2">
                            {{ $actions($row) }}
                        </td>
                    @endif
                </tr>
            @empty
                <tr>
                    <td @class(['px-6 py-8 text-center text-gray-500 text-sm', 'colspan' => count($headers) + ($actions ? 1 : 0)])>
                        No data available
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>
