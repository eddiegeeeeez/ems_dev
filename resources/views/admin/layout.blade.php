<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - Admin Dashboard</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-100">
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-900 text-white">
            <div class="p-6 border-b border-gray-800">
                <h2 class="text-2xl font-bold">Event Manager</h2>
                <p class="text-sm text-gray-400 mt-1">Admin Dashboard</p>
            </div>

            <nav class="p-4 space-y-2">
                <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    📊 Dashboard
                </a>
                
                <div class="pt-4 pb-2 px-4 text-xs uppercase font-semibold text-gray-500">
                    Management
                </div>

                <a href="{{ route('admin.requests.index') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.requests.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    📋 Booking Requests
                </a>

                <a href="{{ route('admin.venues.index') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.venues.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    🏢 Venues
                </a>

                <a href="{{ route('admin.equipment.index') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.equipment.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    🔧 Equipment
                </a>

                <a href="{{ route('admin.maintenance.requests') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.maintenance.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    🔨 Maintenance
                </a>

                <a href="{{ route('admin.users.index') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.users.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    👥 Users
                </a>

                <div class="pt-4 pb-2 px-4 text-xs uppercase font-semibold text-gray-500">
                    Reports
                </div>

                <a href="{{ route('admin.reports.venue') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.reports.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    📈 Reports
                </a>

                <a href="{{ route('admin.audit-logs.index') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.audit-logs.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    📝 Audit Logs
                </a>

                <div class="pt-4 pb-2 px-4 text-xs uppercase font-semibold text-gray-500">
                    Settings
                </div>

                <a href="{{ route('admin.departments.index') }}" class="block px-4 py-2 rounded hover:bg-gray-800 {{ request()->routeIs('admin.departments.*') ? 'bg-gray-800 border-l-4 border-blue-500' : '' }}">
                    🏭 Departments
                </a>
            </nav>

            <!-- Footer -->
            <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 w-64">
                <div class="text-sm text-gray-400">
                    <p>{{ Auth::user()->name }}</p>
                    <p class="text-xs">{{ Auth::user()->role }}</p>
                </div>
                <form method="POST" action="{{ route('logout') }}" class="mt-3">
                    @csrf
                    <button type="submit" class="w-full text-left px-4 py-2 rounded hover:bg-gray-800 text-sm">
                        🚪 Logout
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 pb-20">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div class="px-8 py-4 flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-gray-900">@yield('title')</h1>
                    <div class="flex items-center gap-4">
                        <a href="{{ route('dashboard') }}" class="text-gray-600 hover:text-gray-900">← Back to App</a>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <div class="p-8">
                @if($errors->any())
                <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 class="font-semibold text-red-800 mb-2">Validation Errors</h3>
                    <ul class="list-disc list-inside space-y-1 text-red-700 text-sm">
                        @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                @if(session('success'))
                <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-800 font-medium">✓ {{ session('success') }}</p>
                </div>
                @endif

                @yield('content')
            </div>
        </main>
    </div>
</body>
</html>
