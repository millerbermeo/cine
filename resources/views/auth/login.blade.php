@extends('layouts.page')

@section('content')

<div class="bg-gray-900 text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
    <a href="#" class="text-white font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
        <i class="fa-solid fa-user-circle text-3xl"></i>
        Net Pelix
    </a>

    <div class="relative mt-12 w-full max-w-lg sm:mt-10">
        <div class="relative h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

        <div class="mx-5 border border-gray-700 shadow-lg rounded-lg bg-gray-800 p-6 lg:rounded-xl">
            <h3 class="text-xl font-semibold leading-6 tracking-tighter text-center">Login</h3>
            <p class="mt-2 text-sm text-gray-400 text-center">Bienvenido de nuevo, ingresa tus credenciales.</p>

            <form id="loginForm" class="mt-6">
                @csrf
                <!-- Campo de correo -->
                <div class="relative">
                    <label class="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
                    <div class="relative">
                        <input type="email" id="email" name="email" placeholder="Ingrese su correo"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i class="fa-solid fa-envelope absolute right-4 top-3 text-gray-400"></i>
                    </div>
                    <span class="email-campo m-1 mt-2 text-red-500"></span>
                </div>

                <!-- Campo de contraseña -->
                <div class="relative">
                    <label class="block text-sm text-gray-400 mb-1">Contraseña</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" placeholder="Ingrese su contraseña"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i class="fa-solid fa-lock absolute right-4 top-3 text-gray-400"></i>
                    </div>
                    <span class="password-campo m-1 mt-2 text-red-500"></span>
                </div>


                <!-- Botones -->
                <div class="flex justify-between">
                    <button type="button" onclick="id_auth_usuario.showModal()"
                        class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition">
                        <i class="fa-solid fa-user-plus"></i> Registrarse
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        <i class="fa-solid fa-sign-in-alt"></i> Iniciar sesión
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
{{-- <script>
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        // Obtener los elementos
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const emailError = document.querySelector(".email-campo");
        const passwordError = document.querySelector(".password-campo");

        // Limpiar mensajes previos
        emailError.textContent = "";
        passwordError.textContent = "";

        let isValid = true;

        // Validar email
        if (!emailInput.value.trim()) {
            emailError.textContent = "El email es requerido";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            emailError.textContent = "Ingrese un email válido";
            isValid = false;
        }

        // Validar contraseña
        if (!passwordInput.value.trim()) {
            passwordError.textContent = "La contraseña es requerida";
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = "La contraseña debe tener al menos 6 caracteres";
            isValid = false;
        }

        // Si no es válido, detener el envío
        if (!isValid) return;

        // Enviar formulario con Fetch API si es válido
        const formData = new FormData(this);

        fetch("/post-login", {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('input[name="_token"]').value,
                "Accept": "application/json",
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al iniciar sesión");
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = data.redirect;
        })
        .catch(error => {
            alert("Credenciales incorrectas. Inténtelo de nuevo.");
            console.error(error);
        });
    });
</script> --}}


<dialog id="id_auth_usuario" class="modal">
    <input id="userId" type="hidden" />
    <div class="modal-box">
        <h3 id="modalTitle" class="text-lg font-bold text-center mb-5">Registrarse</h3>
        <div class="w-full">
            <fieldset class="fieldset w-full">
                <legend class="fieldset-legend">Ingresar Nombre</legend>
                <input id="modal-nombre" type="text" class="input w-full" placeholder="Nombre" />
                <p class="fieldset-label">Obligatorio</p>
            </fieldset>

            <fieldset class="fieldset w-full">
                <legend class="fieldset-legend">Ingresar Email</legend>
                <input id="modal-email" type="text" class="input w-full" placeholder="Email" />
                <p class="fieldset-label">Obligatorio</p>
            </fieldset>

            <fieldset class="fieldset w-full">
                <legend class="fieldset-legend">Ingresar Contraseña</legend>
                <input id="modal-password" type="password" class="input w-full" placeholder="Contraseña" />
                <p class="fieldset-label">Obligatorio</p>
            </fieldset>
        </div>
        <div class="flex items-start justify-end gap-5 mt-4">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button id="btn-close-auth" class="btn btn-info">Cerrar</button>
              </form>
          
    
            <div class="modal-action m-0 p-0">
                <button type="button" id="submitFormAuth" class="btn btn-success">Registrarse</button>
            </div>
        </div>
    </div>
</dialog>


@endsection
