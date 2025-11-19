<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'EMS Dashboard')</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-100 font-inter">
    
    {{-- Fixed Header --}}
    <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
        @include('components.header')
    </header>

    {{-- Layout Wrapper --}}
    <div class="flex pt-16"> {{-- Match header height (h-16 = 4rem = 64px) --}}
        {{-- Main Content --}}
        <main class="w-full md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 p-6">
            @yield('content')
        </main>
    </div>

    {{-- Sidebar Component (includes both desktop and mobile versions) --}}
    @auth
        @if(auth()->user()->role === 'ADMIN')
            @include('components.sidebar-admin')
        @else
            @include('components.sidebar-organizer')
        @endif
    @else
        @include('components.sidebar-organizer')
    @endauth
</body>
</html>
