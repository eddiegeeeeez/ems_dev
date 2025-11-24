@props(['title' => 'Confirm', 'description' => '', 'confirmText' => 'Confirm', 'cancelText' => 'Cancel', 'isDangerous' => false, 'open' => false])

@php
$modalId = 'modal-' . uniqid();
$confirmVariant = $isDangerous ? 'danger' : 'primary';
@endphp

<div 
    id="{{ $modalId }}" 
    class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    x-data="{ 
        open: @json($open),
        open() { this.open = true; document.getElementById('{{ $modalId }}').classList.remove('hidden'); },
        close() { this.open = false; document.getElementById('{{ $modalId }}').classList.add('hidden'); }
    }"
    @click="close()"
>
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4" @click.stop>
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">{{ $title }}</h3>
            @if($description)
                <p class="text-sm text-gray-600 mt-2">{{ $description }}</p>
            @endif
        </div>

        <div class="p-6 flex gap-3 justify-end">
            <x-ui.button variant="secondary" @click="close()">
                {{ $cancelText }}
            </x-ui.button>
            <x-ui.button variant="{{ $confirmVariant }}" @click="$dispatch('confirm'); close()">
                {{ $confirmText }}
            </x-ui.button>
        </div>
    </div>
</div>

{{ $slot }}
