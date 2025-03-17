<div
    x-data="{ show: false, message: '', type: 'success' }"
    x-show="show"
    x-transition
    x-cloak
    @toast.window="
        message = $event.detail.message;
        type = $event.detail.type ?? 'success';
        show = true;
        setTimeout(() => show = false, 3000);
    "
    class="fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white"
    :class="{
        'bg-green-500': type === 'success',
        'bg-red-500': type === 'error',
        'bg-yellow-500': type === 'warning',
        'bg-blue-500': type === 'info'
    }"
>
    <span x-text="message"></span>
</div>
