{{-- Loading Spinner Component --}}
<div id="loading-spinner" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-lg shadow-xl p-8 text-center">
        <div class="flex justify-center mb-4">
            <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-transparent border-t-[#c41e3a] rounded-full animate-spin"></div>
            </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Loading</h3>
        <p class="text-sm text-gray-600">Initializing system database...</p>
    </div>
</div>

<style>
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>

<script>
    // Function to show loading spinner
    function showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    // Function to hide loading spinner
    function hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            setTimeout(() => {
                spinner.classList.add('hidden');
            }, 500);
        }
    }

    // Show loading on page transitions
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.includes('#') && !link.target && !link.getAttribute('onclick')) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
                showLoading();
            }
        }
    });

    // Show loading on form submit
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.method === 'POST' || form.method === 'post') {
            showLoading();
        }
    });

    // Hide loading when page fully loads
    window.addEventListener('load', hideLoading);
</script>
