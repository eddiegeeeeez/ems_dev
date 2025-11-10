<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'EMS Dashboard')</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="{{ asset('dashboard.css') }}">
</head>
<body class="bg-gray-100">

    <div class="flex min-h-screen">
        
        @include('components.sidebar')

        <div id="main-content" class="flex-1 md:ml-64 flex flex-col transition-all duration-300 ease-in-out">
            
            <header class="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200">
                <button id="menu-toggle" class="md:hidden text-gray-600 hover:text-gray-900">
                    <span class="w-6 h-6">
                        <img src="{{ asset('icons/menu.svg') }}" alt="Menu" class="w-full h-full">
                    </span>
                </button>
                
                <div class="flex-1"></div>

                <div class="flex items-center gap-5">
                    <button class="text-gray-500 hover:text-gray-700 relative">
                        <span class="w-6 h-6">
                            <img src="{{ asset('icons/bell.svg') }}" alt="Notifications" class="w-full h-full">
                        </span>
                        <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                    <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full text-green-700 font-semibold">
                        EA
                    </div>
                </div>
            </header>

            <main class="flex-1 p-6 md:p-10">
                @yield('content')
            </main>.
        </div>

        <div id="sidebar-overlay" class="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden hidden"></div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            const menuToggle = document.getElementById('menu-toggle');
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebar-overlay');

            if (menuToggle && sidebar && sidebarOverlay) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('-translate-x-full');
                    sidebarOverlay.classList.toggle('hidden');
                });

                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.add('-translate-x-full');
                    sidebarOverlay.classList.add('hidden');
                });
            }
        });
    </script>
</body>
</html>