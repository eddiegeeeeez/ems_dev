@props(['type' => 'text', 'placeholder' => '', 'value' => '', 'label' => '', 'error' => '', 'disabled' => false, 'class' => ''])

<div class="mb-4">
    @if($label)
        <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $label }}
        </label>
    @endif
    
    <input
        type="{{ $type }}"
        placeholder="{{ $placeholder }}"
        value="{{ $value }}"
        @if($disabled) disabled @endif
        @class([
            'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all',
            'border-red-500 focus:ring-red-500' => $error,
            'border-gray-300 focus:ring-blue-500' => !$error,
            'bg-gray-50 cursor-not-allowed' => $disabled,
            $class
        ])
        {{ $attributes }}
    />
    
    @if($error)
        <span class="text-red-500 text-sm mt-1">{{ $error }}</span>
    @endif
</div>
