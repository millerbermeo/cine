<!-- Botón para abrir el Sidebar -->

<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">

</head>
{{-- <div class="sm:hidden py-16 text-center">
  <button id="openSidebar" class="py-2 px-4 bg-[#FF690F] border border-[#FF690F] text-white text-sm font-medium rounded-lg hover:bg-[#E56A0E] transition-colors duration-300">
    Open Sidebar
  </button>
</div> --}}

<!-- Sidebar -->
<div id="sidebar" class="w-[290px] min-w-[200px] h-screen border-r-[1px] border-gray-200 bg-white transform -translate-x-full transition-transform duration-300 sm:translate-x-0">
  <!-- Encabezado del Sidebar -->
  <div class="flex items-center gap-3 py-4 px-5 bg-[#FDF2F2]">
    <img class="w-10 h-10 rounded-full bg-[#FF5252]" src="{{ asset('images/logo.png') }}" alt="Logo">
    <span class="text-2xl font-semibold text-[#FF5252]">Net Pelis</span>
    <button id="closeSidebar" class="sm:hidden text-gray-600 hover:text-gray-800 ml-auto">✕</button>
  </div>

  <!-- Navegación -->
  <nav class="p-4">
    <ul class="space-y-2">
      <!-- Menú Principal -->
      <li>
        <a href="/home" class="flex items-center gap-x-3 py-3 px-4 text-lg text-[#FF5252] bg-[#FFEAEA] rounded-lg transition-all duration-200">
            <i class="fas fa-home"></i> Home
        </a>
      </li>
      <li>
        <a href="/usuarios" class="flex items-center gap-x-3 py-3 px-4 text-lg text-gray-800 rounded-lg hover:bg-[#FFEAEA] hover:text-[#FF5252] transition-all duration-200">
            <i class="fas fa-users"></i> Usuarios
        </a>
      </li>
      <li>
        <a href="/peliculas" class="flex items-center gap-x-3 py-3 px-4 text-lg text-gray-800 rounded-lg hover:bg-[#FFEAEA] hover:text-[#FF5252] transition-all duration-200">
            <i class="fas fa-film"></i>
            Peliculas
        </a>
      </li>
      <li>
        <a href="/categorias" class="flex items-center gap-x-3 py-3 px-4 text-lg text-gray-800 rounded-lg hover:bg-[#FFEAEA] hover:text-[#FF5252] transition-all duration-200">
            <i class="fas fa-list"></i>
            Categorias
        </a>
      </li>

      <li>
        <button  onclick="id_modal_logout.showModal()" class="flex items-center gap-x-3 py-3 px-4 text-lg text-[#FF5252] rounded-lg hover:bg-[#FFEAEA] hover:text-[#FF5252] transition-all duration-200">
          🔓 Logout
        </button>
      </li>
    </ul>
  </nav>


  <dialog id="id_modal_logout" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold text-center mb-5">Esta seguro que desea cerrar la Session?</h3>
  

          
            <div class="modal-action">
                <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn">Close</button>
                </form>
                <div class="modal-action m-0 p-0">
                    <button id="logoutsession" class="btn modalTitle">Cerrar Session</button>
                </div>
              </div>
     

    </div>
</dialog>

</div>

<!-- Script de Funcionalidad -->
<script>
  document.getElementById("logoutsession").addEventListener("click", function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

    fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,  // Token CSRF
            "Accept": "application/json",
        },
    })
    .then(response => {
        if (response.ok) {
            showToast("Cierre de Sesión Exitoso", "success");
            window.location.href = "/";  // Redirigir al login
        } else {
            throw new Error("Error al cerrar sesión");
        }
    })
    .catch(error => console.error("Error:", error));
    window.location.reload()
});

</script>
