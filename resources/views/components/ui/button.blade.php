@props(['type' => 'button', 'variant' => 'primary', 'size' => 'md', 'disabled' => false, 'class' => ''])

@php
$baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

$variants = [
    'primary' => 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    'secondary' => 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400',
    'danger' => 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    'success' => 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    'ghost' => 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
    'outline' => 'border-2 border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-400',
];

$sizes = [
    'sm' => 'px-3 py-1.5 text-sm',
    'md' => 'px-4 py-2 text-base',
    'lg' => 'px-6 py-3 text-lg',
    'xl' => 'px-8 py-4 text-xl',
];

$buttonClass = "{$baseStyles} {$variants[$variant]} {$sizes[$size]} {$class}";
@endphp

@if ($type === 'button')
    <button 
        type="button" 
        {{ $disabled ? 'disabled' : '' }}
        @class([$buttonClass])
        {{ $attributes }}
    >
        {{ $slot }}
    </button>
@elseif ($type === 'submit')
    <button 
        type="submit" 
        {{ $disabled ? 'disabled' : '' }}
        @class([$buttonClass])
        {{ $attributes }}
    >
        {{ $slot }}
    </button>
@elseif ($type === 'link')
    <a 
        {{ $disabled ? 'class=opacity-50 cursor-not-allowed' : '' }}
        @class([$buttonClass])
        {{ $attributes }}
    >
        {{ $slot }}
    </a>
@endif
