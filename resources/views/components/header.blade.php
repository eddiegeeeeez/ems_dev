<div class="flex items-center gap-3">
    {{-- Mobile Menu Toggle --}}
    <button 
        id="menu-toggle"
        class="md:hidden p-2 text-gray-600 rounded-lg transition-all duration-300 hover:bg-[#c41e3a] hover:text-white active:scale-95"
        aria-label="Toggle menu"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>
    
    <a 
        href="{{ route('dashboard') }}" 
        class="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-8 w-8 text-[#c41e3a]">
            <path d="M22 10v6m0 0l-8.5 4.35a2 2 0 01-1.998 0L2 16m20-6V8a2 2 0 00-2-2H4a2 2 0 00-2 2v2m20 0l-9-4.35a2 2 0 00-2 0l-9 4.35"/>
        </svg>
        <div class="hidden sm:flex flex-col">
            <span class="text-xs md:text-sm font-bold text-[#c41e3a]">UM EVENTS</span>
            <span class="text-xs text-gray-600">Management</span>
        </div>
    </a>
</div>
<div class="flex items-center gap-2 md:gap-4">

    {{-- Notifications Panel --}}
    @include('components.notifications-panel')

    {{-- User Dropdown --}}
    <div class="relative">
        <button 
            onclick="toggleDropdown()" 
            class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
            <img 
                src="{{ auth()->user()->avatar ?? '' }}" 
                alt="{{ auth()->user()->name ?? 'User' }}" 
                class="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover"
            >
        </button>

        <div id="userDropdown" 
             class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg hidden z-50">
            <div class="px-4 py-4 border-b border-gray-100">
                <p class="text-sm font-bold text-gray-900">{{ auth()->user()?->name }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ auth()->user()?->email }}</p>
                <p class="text-xs text-[#c41e3a] font-semibold mt-2 uppercase tracking-wide">
                    {{ auth()->user()?->role === 'ADMIN' ? 'Administrator' : 'Event Organizer' }}
                </p>
            </div>

            <a href="{{ route('dashboard') }}" 
               class="block px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 border-b border-gray-100">
                Profile
            </a>

            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    Logout
                </button>
            </form>
        </div>
    </div>
</div>
<script>
    function toggleDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('hidden');
    }

    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown.contains(event.target) && !event.target.closest('button[onclick="toggleDropdown()"]')) {
            dropdown.classList.add('hidden');
        }
    });
</script>