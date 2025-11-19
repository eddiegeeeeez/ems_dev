@extends('layouts.app')

@section('content')
<div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Departments</h1>
            <p class="text-gray-600 mt-1">Manage organizational departments</p>
        </div>
        <a href="{{ route('admin.departments.create') }}" class="px-6 py-2 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830]">
            Add Department
        </a>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($departments ?? [] as $dept)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ $dept->name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ $dept->description }}</td>
                    <td class="px-6 py-4 text-sm space-x-2">
                        <a href="{{ route('admin.departments.edit', $dept->id) }}" class="text-[#c41e3a] hover:text-[#a01830] font-medium">Edit</a>
                        <form method="POST" action="{{ route('admin.departments.destroy', $dept->id) }}" class="inline" onsubmit="return confirm('Delete this department?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 hover:text-red-700 font-medium">Delete</button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="3" class="px-6 py-8 text-center text-gray-500">No departments found</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
