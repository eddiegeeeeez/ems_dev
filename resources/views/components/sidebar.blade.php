<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex-col flex transition-transform duration-300 ease-in-out transform -translate-x-full md:translate-x-0">
    
    <div class="flex items-center gap-3 h-20 px-6 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full text-white font-bold text-xl">
            UM
        </div>
        <div class="flex flex-col">
            <span class="text-sm font-semibold text-red-600">UM EVENTS</span>
            <span class="text-xs text-gray-500">Management</span>
        </div>
    </div>

    <div class="flex items-center gap-3 px-6 py-5">
        <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full text-green-700 font-semibold">
            EA
        </div>
        <div class="flex flex-col min-w-0">
            <span class="text-sm font-medium text-gray-900 truncate">Edgar Allain Sobrem...</span>
            <span class="text-xs text-gray-500 truncate">edgar.garcia@umindanao.e...</span>
        </div>
    </div>

    <div class="px-6 py-2">
        <span class="inline-block px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md">
            EVENT ORGANIZER
        </span>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <span class="px-2 text-xs font-semibold text-gray-400 uppercase">Organizer Menu</span>
        <ul class="space-y-1 mt-2">
            
            <li>
                <a href="{{ route('dashboard') }}" 
                   class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md

                          {{ Route::is('dashboard') 
                             ? 'text-red-600 bg-red-50 border-l-4 border-red-600' 
                             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                    <span class="w-5 h-5">
                        <img src="{{ asset('icons/layout-dashboard.svg') }}" alt="Dashboard" class="w-full h-full">
                    </span>
                    Dashboard
                </a>
            </li>
            
            <li>
                <a href="{{ route('venues.index') }}" 
                   class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md

                          {{ Route::is('venues.*')
                             ? 'text-red-600 bg-red-50 border-l-4 border-red-600' 
                             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                    <span class="w-5 h-5">
                        <img src="{{ asset('icons/building-2.svg') }}" alt="Browse Venues" class="w-full h-full">
                    </span>
                    Browse Venues
                </a>
            </li>

            <li>
                <a href="{{ route('bookings.index') }}" 
                   class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md
                          {{ Route::is('bookings.*') 
                             ? 'text-red-600 bg-red-50 border-l-4 border-red-600' 
                             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                    <span class="w-5 h-5">
                        <img src="{{ asset('icons/calendar.svg') }}" alt="My Bookings" class="w-full h-full">
                    </span>
                    My Bookings
                </a>
            </li>

            <li>
                <a href="{{ route('feedback.index') }}" 
                   class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md
                          {{ Route::is('feedback.*') 
                             ? 'text-red-600 bg-red-50 border-l-4 border-red-600' 
                             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                    <span class="w-5 h-5">
                        <img src="{{ asset('icons/message-square.svg') }}" alt="My Feedback" class="w-full h-full">
                    </span>
                    My Feedback
                </a>
            </li>

            <li>
                <a href="{{ route('profile.show') }}" 
                   class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md
                          {{ Route::is('profile.*') 
                             ? 'text-red-600 bg-red-50 border-l-4 border-red-600' 
                             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                    <span class="w-5 h-5">
                        <img src="{{ asset('icons/user.svg') }}" alt="My Profile" class="w-full h-full">
                    </span>
                    My Profile
                </a>
            </li>
        </ul>
    </nav>

    <div class="px-4 py-4 mt-auto border-t border-gray-200">
        
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" 
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md">
                <span class="w-5 h-5">
                    <img src="{{ asset('icons/log-out.svg') }}" alt="Logout" class="w-full h-full">
                </span>
                Logout
            </button>
        </form>
    </div>
</aside>