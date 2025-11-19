@php
    // Get current user's notifications (you can adjust this based on your actual database queries)
    $notifications = auth()->user()?->notifications()->latest()->get() ?? collect();
    $unreadCount = $notifications->where('read_at', null)->count();
    
    // Helper function to get notification icon and color
    function getNotificationIcon($type) {
        $icons = [
            'approval' => [
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4caf50]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                'label' => 'Approval'
            ],
            'rejection' => [
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
                'label' => 'Rejection'
            ],
            'booking' => [
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 5V1h-1v4H8.01V1H7v4H3.99C2.89 5 2 5.9 2 7v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3V1h-1v4h-3zm11 14H2V7h16v12z"/></svg>',
                'label' => 'Booking'
            ],
            'default' => [
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.96 3.36 6.4 5.92 6.4 9v5l-2 2v1h15.6v-1l-2-2z"/></svg>',
                'label' => 'Notification'
            ]
        ];
        
        return $icons[$type] ?? $icons['default'];
    }
@endphp

<!-- Notification Bell Button with Popover -->
<div class="relative">
    <button 
        id="notification-trigger"
        class="relative p-2 text-gray-600 hover:text-[#c41e3a] transition-colors duration-200"
        aria-label="Notifications"
        onclick="toggleNotificationPanel()"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        @if($unreadCount > 0)
        <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#c41e3a] animate-pulse"></span>
        @endif
    </button>

    <!-- Notification Panel (Hidden by default) -->
    <div 
        id="notification-panel"
        class="hidden fixed right-4 top-20 w-96 max-h-96 bg-white rounded-lg shadow-lg border border-gray-200 z-40 flex flex-col overflow-hidden"
    >
        <!-- Header -->
        <div class="border-b border-gray-200 p-4 bg-gray-50">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-gray-900 text-lg">Notifications</h3>
                <button 
                    onclick="toggleNotificationPanel()"
                    class="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-xs text-gray-600">
                @if($unreadCount > 0)
                    You have <span class="font-semibold">{{ $unreadCount }}</span> unread notification(s)
                @else
                    No new notifications
                @endif
            </p>
        </div>

        <!-- Notifications List -->
        <div class="flex-1 overflow-y-auto">
            @if($notifications->isEmpty())
                <div class="flex flex-col items-center justify-center py-12 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p class="text-gray-600 text-sm">No notifications yet</p>
                </div>
            @else
                <div class="space-y-0 divide-y divide-gray-100">
                    @foreach($notifications as $notification)
                        @php
                            $icon = getNotificationIcon($notification->data['type'] ?? 'default');
                            $isUnread = $notification->read_at === null;
                        @endphp
                        
                        <div class="p-4 @if($isUnread) bg-blue-50 border-l-4 border-blue-400 @else bg-white @endif hover:bg-gray-50 transition-colors">
                            <div class="flex items-start gap-3">
                                <!-- Icon -->
                                <div class="flex-shrink-0 mt-1">
                                    {!! $icon['svg'] !!}
                                </div>

                                <!-- Content -->
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-gray-900 text-sm">
                                        {{ $notification->data['title'] ?? 'Notification' }}
                                    </h4>
                                    <p class="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {{ $notification->data['message'] ?? 'You have a new notification' }}
                                    </p>
                                    <p class="text-xs text-gray-500 mt-2">
                                        {{ $notification->created_at->format('M d, Y \a\t g:i A') }}
                                    </p>
                                </div>

                                <!-- Mark as read button -->
                                @if($isUnread)
                                    <form method="POST" action="{{ route('notifications.mark-read', $notification->id) }}" class="flex-shrink-0">
                                        @csrf
                                        <button 
                                            type="submit"
                                            class="text-xs px-2 py-1 text-[#c41e3a] hover:text-[#a01830] font-medium transition-colors whitespace-nowrap"
                                        >
                                            Mark read
                                        </button>
                                    </form>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        <!-- Footer with View All button -->
        @if($notifications->isNotEmpty())
        <div class="border-t border-gray-200 p-4 bg-gray-50">
            <a 
                href="{{ route('notifications.index') }}"
                class="block w-full text-center text-sm font-medium text-[#c41e3a] hover:text-[#a01830] transition-colors py-2"
            >
                View All Notifications
            </a>
        </div>
        @endif
    </div>

    <!-- Overlay to close panel when clicking outside -->
    <div 
        id="notification-overlay"
        class="hidden fixed inset-0 z-30"
        onclick="toggleNotificationPanel()"
    ></div>
</div>

<script>
    function toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        const overlay = document.getElementById('notification-overlay');
        
        const isHidden = panel.classList.contains('hidden');
        
        if (isHidden) {
            // Show panel
            panel.classList.remove('hidden');
            panel.style.animation = 'fadeIn 0.2s ease-in-out';
            overlay.classList.remove('hidden');
        } else {
            // Hide panel
            panel.classList.add('hidden');
            overlay.classList.add('hidden');
        }
    }

    // Close panel when pressing Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const panel = document.getElementById('notification-panel');
            if (!panel.classList.contains('hidden')) {
                toggleNotificationPanel();
            }
        }
    });
</script>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
