@php
    $organizerSections = [
        [
            'title' => 'Dashboard',
            'isDirectLink' => true,
            'href' => 'dashboard',
            'icon' => 'dashboard'
        ],
        [
            'title' => 'Bookings',
            'links' => [
                ['href' => 'venues.index', 'label' => 'Browse Venues', 'icon' => 'building'],
                ['href' => 'bookings.index', 'label' => 'My Bookings', 'icon' => 'calendar'],
            ]
        ],
        [
            'title' => 'My Feedback',
            'isDirectLink' => true,
            'href' => 'feedback.index',
            'icon' => 'user'
        ],
        [
            'title' => 'Account',
            'links' => [
                ['href' => 'profile.show', 'label' => 'My Profile', 'icon' => 'user'],
            ]
        ]
    ];
    
    $sections = $organizerSections;
@endphp

<style>
    .menu-item-content {
        display: none;
        animation: slideDown 0.25s ease-in-out forwards;
    }

    .menu-item-content.show {
        display: block !important;
        animation: slideDown 0.25s ease-in-out forwards;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .dropdown-chevron {
        transition: transform 0.25s ease-in-out;
        transform: rotate(0deg);
    }

    .dropdown-chevron.rotated {
        transform: rotate(180deg) !important;
    }

    .section-button:hover {
        background-color: rgba(196, 30, 58, 0.05);
    }

    .nav-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    /* Mobile Sidebar Animations */
    #mobile-sidebar {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }

    #mobile-sidebar:not(.hidden) {
        opacity: 1;
        visibility: visible;
    }

    #mobile-sidebar-overlay {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    #mobile-sidebar:not(.hidden) #mobile-sidebar-overlay {
        opacity: 1;
    }

    #mobile-sidebar.hidden {
        pointer-events: none;
    }

    #mobile-sidebar:not(.hidden) aside {
        animation: slideInFromLeft 0.3s ease-in-out forwards;
    }

    #mobile-sidebar.hidden aside {
        animation: slideOutToLeft 0.3s ease-in-out forwards;
    }

    @keyframes slideInFromLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutToLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }

    /* Fade out animation for overlay */
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    #mobile-sidebar.hidden #mobile-sidebar-overlay {
        animation: fadeOut 0.3s ease-in-out forwards;
    }
</style>

<!-- Desktop Sidebar -->
<aside class="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] flex-col border-r border-slate-200 bg-white">
    <!-- Navigation Content -->
    <div class="flex-1 overflow-y-auto px-4 py-6">
        <div class="mb-6">
            <h3 class="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Organizer Menu
            </h3>

            <nav class="space-y-2">
                @foreach($sections as $sectionIndex => $section)
                    @if($section['isDirectLink'] ?? false)
                        <!-- Direct Link Item -->
                        <a href="{{ route($section['href']) }}" class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 @if(Route::is($section['href'])) bg-[#c41e3a] text-white shadow-sm @else text-slate-700 hover:bg-slate-100 @endif">
                            @include('components.icon', ['icon' => $section['icon'], 'class' => 'h-4 w-4 flex-shrink-0'])
                            <span>{{ $section['title'] }}</span>
                        </a>
                    @else
                        <!-- Collapsible Section -->
                        <div class="space-y-0">
                            <button class="section-button w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200" onclick="toggleMenu(this, 'menu-{{ $sectionIndex }}')">
                                <span>{{ $section['title'] }}</span>
                                <svg class="dropdown-chevron h-4 w-4 text-slate-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 10l5 5 5-5z"/>
                                </svg>
                            </button>

                            <!-- Dropdown Content -->
                            <div id="menu-{{ $sectionIndex }}" class="menu-item-content">
                                <div class="space-y-1 pl-6">
                                    @foreach($section['links'] as $link)
                                        <a href="{{ route($link['href']) }}" class="nav-item flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-150 @if(Route::is($link['href'])) bg-[#c41e3a] text-white @endif">
                                            @include('components.icon', ['icon' => $link['icon'], 'class' => 'h-4 w-4 flex-shrink-0'])
                                            <span>{{ $link['label'] }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @endif
                @endforeach
            </nav>
        </div>
    </div>

    <!-- User Info Footer -->
    <div class="border-t border-slate-200 p-4 bg-slate-50">
        <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#4caf50] text-white font-semibold text-sm flex-shrink-0">
                {{ substr(Auth::user()->name ?? 'U', 0, 1) }}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ Auth::user()->name ?? 'User' }}</p>
                <p class="text-xs text-slate-500 truncate">{{ Auth::user()->email ?? '' }}</p>
                <span class="inline-block text-xs font-semibold text-white bg-[#c41e3a] px-2 py-1 rounded mt-1">
                    {{ Auth::user()->role ?? 'ORGANIZER' }}
                </span>
            </div>
        </div>
    </div>
</aside>

<!-- Mobile Sidebar -->
<div id="mobile-sidebar" class="fixed inset-0 z-40 hidden md:hidden">
    <div class="absolute inset-0 bg-black/50" id="mobile-sidebar-overlay"></div>
    <aside class="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        <!-- Mobile Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 class="font-semibold text-slate-900">Menu</h2>
            <button id="mobile-sidebar-close" class="p-1 hover:bg-slate-100 rounded transition-colors" type="button">
                <svg class="h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Mobile Navigation -->
        <div class="flex-1 overflow-y-auto px-4 py-6">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Organizer Menu
            </h3>
            <nav class="space-y-2">
                @foreach($sections as $sectionIndex => $section)
                    @if($section['isDirectLink'] ?? false)
                        <a href="{{ route($section['href']) }}" class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 @if(Route::is($section['href'])) bg-[#c41e3a] text-white shadow-sm @else text-slate-700 hover:bg-slate-100 @endif" onclick="closeMobileSidebar()">
                            @include('components.icon', ['icon' => $section['icon'], 'class' => 'h-4 w-4 flex-shrink-0'])
                            <span>{{ $section['title'] }}</span>
                        </a>
                    @else
                        <div class="space-y-0">
                            <button class="section-button w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200" onclick="toggleMenu(this, 'menu-mobile-{{ $sectionIndex }}')">
                                <span>{{ $section['title'] }}</span>
                                <svg class="dropdown-chevron h-4 w-4 text-slate-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 10l5 5 5-5z"/>
                                </svg>
                            </button>

                            <div id="menu-mobile-{{ $sectionIndex }}" class="menu-item-content">
                                <div class="space-y-1 pl-6">
                                    @foreach($section['links'] as $link)
                                        <a href="{{ route($link['href']) }}" class="nav-item flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all duration-150 @if(Route::is($link['href'])) bg-[#c41e3a] text-white @endif" onclick="closeMobileSidebar()">
                                            @include('components.icon', ['icon' => $link['icon'], 'class' => 'h-4 w-4 flex-shrink-0'])
                                            <span>{{ $link['label'] }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    @endif
                @endforeach
            </nav>
        </div>

        <!-- Mobile User Footer -->
        <div class="border-t border-slate-200 p-4 bg-slate-50">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#4caf50] text-white font-semibold text-sm flex-shrink-0">
                    {{ substr(Auth::user()->name ?? 'U', 0, 1) }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ Auth::user()->name ?? 'User' }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ Auth::user()->email ?? '' }}</p>
                    <span class="inline-block text-xs font-semibold text-white bg-[#c41e3a] px-2 py-1 rounded mt-1">
                        {{ Auth::user()->role ?? 'ORGANIZER' }}
                    </span>
                </div>
            </div>
        </div>
    </aside>
</div>

<script>
    // Global function to toggle menus
    function toggleMenu(button, menuId) {
        const menu = document.getElementById(menuId);
        const chevron = button.querySelector('.dropdown-chevron');
        
        if (!menu) return;
        
        const isVisible = menu.classList.contains('show');
        
        if (isVisible) {
            // Hide menu
            menu.classList.remove('show');
            if (chevron) chevron.classList.remove('rotated');
        } else {
            // Show menu
            menu.classList.add('show');
            if (chevron) chevron.classList.add('rotated');
        }
    }

    // Mobile sidebar functions
    function closeMobileSidebar() {
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const sidebarToggle = document.getElementById('menu-toggle');
        
        if (mobileSidebar && !mobileSidebar.classList.contains('hidden')) {
            mobileSidebar.classList.add('hidden');
            // Remove hover state from button
            if (sidebarToggle) {
                sidebarToggle.blur();
            }
            // Wait for animation to complete before setting visibility
            setTimeout(() => {
                if (mobileSidebar.classList.contains('hidden')) {
                    mobileSidebar.style.display = 'none';
                }
            }, 300);
        }
    }

    function openMobileSidebar() {
        const mobileSidebar = document.getElementById('mobile-sidebar');
        if (mobileSidebar) {
            mobileSidebar.style.display = '';
            // Trigger reflow to ensure animation plays
            void mobileSidebar.offsetHeight;
            mobileSidebar.classList.remove('hidden');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Mobile sidebar controls
        const sidebarToggle = document.getElementById('menu-toggle'); // Use header's menu-toggle button
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const sidebarOverlay = document.getElementById('mobile-sidebar-overlay');
        const sidebarClose = document.getElementById('mobile-sidebar-close');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                if (mobileSidebar.classList.contains('hidden')) {
                    openMobileSidebar();
                } else {
                    closeMobileSidebar();
                }
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeMobileSidebar);
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeMobileSidebar);
        }

        // Close sidebar when clicking outside (on body)
        document.addEventListener('click', function(e) {
            if (mobileSidebar && !mobileSidebar.classList.contains('hidden')) {
                if (!mobileSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    closeMobileSidebar();
                }
            }
        });
    });
</script>
