@props(['user'])

@php
// Constants for colors to easily manage them (mirroring React component)
$profileBgColor = '#4caf50'; // Green
$roleBgColor = '#941a1d';    // Dark Red

// Generate initials from user name if not provided
if (!isset($user->initials) && isset($user->name)) {
    $nameParts = explode(' ', $user->name);
    $initials = strtoupper(substr($nameParts[0], 0, 1) . (count($nameParts) > 1 ? substr(end($nameParts), 0, 1) : ''));
} else {
    $initials = $user->initials ?? 'U';
}
@endphp

<div class="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200/80">
    
    <!-- 1. Header background section with gradient overlay -->
    <div class="h-32 md:h-28 w-full bg-cover bg-center relative" 
         style="background-image: url('https://picsum.photos/1200/200?grayscale&blur=1')">
        
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-red-800 via-red-900 to-black opacity-80"></div>
        
        <!-- Decorative shape 1 (left side) -->
        <div class="absolute top-0 left-0 w-1/3 h-full bg-red-800" 
             style="clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%)"></div>
        
        <!-- Decorative shape 2 (right side) -->
        <div class="absolute bottom-0 right-0 h-full w-20 bg-gray-800" 
             style="clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%)"></div>
        
        <!-- Decorative shape 3 (accent bar) -->
        <div class="absolute bottom-0 right-[70px] h-full w-6 bg-red-800" 
             style="clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%)"></div>

        <!-- Header content (title + contact info) -->
        <div class="absolute top-0 left-0 right-0 h-full flex items-center justify-between px-4 sm:px-8 text-white">
            <h1 class="text-2xl md:text-4xl font-bold tracking-wider uppercase" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);">
                Digital Library Portal
            </h1>
            <div class="hidden md:flex items-center space-x-4 text-xs">
                <!-- Facebook -->
                <div class="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <a href="#" class="hover:underline">UMindanaoLIC</a>
                </div>
                
                <!-- Phone -->
                <div class="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <p>0951-376-6681</p>
                </div>
                
                <!-- Email -->
                <div class="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <p>library@umindanao.edu.ph</p>
                </div>
                
                <!-- Website -->
                <div class="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9-9a9 9 0 019-9"/>
                    </svg>
                    <a href="#" class="hover:underline">https://dlpmain.umindanao.edu.ph</a>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Profile Avatar & Details Section -->
    <div class="relative px-4 sm:px-6 pb-4 pt-0">
        
        <!-- Profile Picture Avatar -->
        <div class="absolute -top-10 left-4 sm:left-6">
            <div class="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg" 
                 style="background-color: {{ $profileBgColor }}">
                {{ $initials }}
            </div>
        </div>

        <!-- User Details Block -->
        <div class="ml-0 pt-12 md:ml-[110px] md:pt-4">
            <div class="flex items-baseline space-x-3 flex-wrap">
                <h2 class="text-lg md:text-xl font-bold text-gray-800">{{ $user->name }}</h2>
                <span class="inline-block text-xs font-semibold text-white px-3 py-1 rounded-md uppercase tracking-wide mt-1 sm:mt-0" 
                      style="background-color: {{ $roleBgColor }}">
                    {{ $user->role }}
                </span>
            </div>
            <p class="text-sm font-medium text-gray-500 mt-1 uppercase">{{ $user->department }}</p>
        </div>
    </div>
</div>
