<aside id="sidebar" class="flex flex-col h-full overflow-y-auto">
    <div class="flex-1 px-4 py-6">

        <div class="mb-6">
            <h3 class="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Admin Menu
            </h3>

            <nav class="space-y-1">
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-[#c41e3a] text-white transition-colors">
                    <img src="{{ asset('icons/layout-dashboard.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Dashboard</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/file-text.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Pending Requests</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/calendar.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Venue Calendar</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/building-2.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Manage Venues</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/settings.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Equipment</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/message-square.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Feedback Reports</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/bar-chart-3.svg') }}" class="h-4 w-4" alt="icon">
                    <span>Reports & Analytics</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <img src="{{ asset('icons/user.svg') }}" class="h-4 w-4" alt="icon">
                    <span>My Profile</span>
                </a>
            </nav>
        </div>
    </div>
    <div class="border-t border-gray-200 p-4">
        <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <img src="{{ asset('icons/log-out.svg') }}" class="h-4 w-4" alt="logout">
            Logout
        </button>
    </div>
</aside>