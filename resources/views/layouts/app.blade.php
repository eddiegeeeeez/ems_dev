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
        {{-- Sidebar --}}
        <aside class="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 flex-col border-r border-gray-200 bg-white">
            @include('components.sidebar')
        </aside>

        {{-- Main Content --}}
        <main class="flex-1 md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 p-6">
            @yield('content')
        </main>
    </div>

    {{-- Mobile Sidebar Overlay --}}
    <div id="sidebar-overlay" class="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden hidden"></div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const menuToggle = document.getElementById('menu-toggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');

            if (menuToggle && sidebar && overlay) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('-translate-x-full');
                    overlay.classList.toggle('hidden');
                });

                overlay.addEventListener('click', () => {
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                });
            }
        });
    </script>
</body>
</html>
