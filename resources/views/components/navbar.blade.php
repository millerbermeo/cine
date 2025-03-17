<div class="flex justify-between items-center bg-white w-[97.5%] py-3 px-6 mx-auto my-3 rounded-xl shadow-md">
    <!-- Título del Panel -->
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold text-[#FF5252]">Dashboard</h1>
      <span class="text-gray-400 text-sm">Administracion de Peliculas</span>
    </div>
  
    <!-- Barra de Búsqueda e Íconos -->
    <div class="flex items-center gap-4">
      <!-- Barra de Búsqueda -->
      <div class="relative">
        <input
          type="text"
          placeholder="Search movie, series, artist"
          class="w-72 py-2 pl-10 pr-4 bg-gray-100 text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <span class="absolute left-3 top-2 text-gray-400">
          🔍
        </span>
      </div>
  
  
      <!-- Icono de Perfil con Dropdown -->
      <div class="relative group">
        <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          👤
        </button>
        {{-- <ul class="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-40 hidden group-hover:block">
          <li>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
          </li>
        </ul> --}}
      </div>
    </div>
  </div>

  
  