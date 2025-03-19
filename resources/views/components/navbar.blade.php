<div class="flex justify-between items-center bg-white w-[97.5%] py-3 px-6 mx-auto my-3 rounded-xl shadow-md  z-30">
    <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-[#FF5252]">Dashboard</h1>
        <span class="text-gray-400 text-sm">Administracion de Peliculas</span>
    </div>
    <div class="flex items-center gap-4">
        <div class="relative flex items-center gap-4">
            <div class="flex flex-col items-end text-right">
                @if(Auth::check())
                    <p class="text-sm font-medium text-gray-700">👤 Usuario: <span class="font-semibold">{{ Auth::user()->nombre }}</span></p>
                    <p class="text-sm text-gray-500">{{ Auth::user()->email }}</p>
                @else
                    <p class="text-sm font-medium text-red-500">⚠ No hay usuario autenticado.</p>
                @endif
            </div>
            
            <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md">
                👤
            </button>
        </div>
        
    </div>
</div>