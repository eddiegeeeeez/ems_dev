@props(['title' => '', 'subtitle' => '', 'footer' => '', 'class' => ''])

<div @class(['bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden', $class])>
    @if($title || $subtitle)
        <div class="px-6 py-4 border-b border-gray-200">
            @if($title)
                <h2 class="text-xl font-bold text-gray-900">{{ $title }}</h2>
            @endif
            @if($subtitle)
                <p class="text-sm text-gray-600 mt-1">{{ $subtitle }}</p>
            @endif
        </div>
    @endif

    <div class="px-6 py-4">
        {{ $slot }}
    </div>

    @if($footer)
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {{ $footer }}
        </div>
    @endif
</div>
