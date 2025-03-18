@extends('layouts.login')

@section('content')

<div class="bg-gray-900  flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
    <a href="#" class="font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2 text-[#FF5252]">
        <i class="fa-solid fa-user-circle text-3xl"></i>
        Net Pelix
    </a>

    <div class="relative mt-12 w-full max-w-lg sm:mt-10">
        <div class="relative h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

        <div class="mx-5 border border-gray-700 shadow-lg rounded-lg bg-gray-800 p-6 lg:rounded-xl">
            <h3 class="text-xl font-semibold leading-6 tracking-tighter text-center text-[#FF5252]">Login</h3>
            <p class="mt-2 text-sm text-gray-400 text-center">Bienvenido de nuevo, ingresa tus credenciales.</p>

            <form id="loginForm" class="mt-6">
                @csrf
                <!-- correo -->
                <div class="relative">
                    <label class="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
                    <div class="relative">
                        <input type="email" id="email" name="email" placeholder="Ingrese su correo"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i class="fa-solid fa-envelope absolute right-4 top-3 text-gray-400"></i>
                    </div>
                    <span class="email-campo m-1 mt-2 text-white"></span>
                </div>

                <!-- contraseña -->
                <div class="relative">
                    <label class="block text-sm text-gray-400 mb-1">Contraseña</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" placeholder="Ingrese su contraseña"
                            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i class="fa-solid fa-lock absolute right-4 top-3 text-gray-400"></i>
                    </div>
                    <span class="password-campo m-1 mt-2 text-white"></span>
                </div>

                <div class="flex justify-between">
                    <button type="button" onclick="id_auth_usuario.showModal()"
                        class="px-4 py-2 bg-gray-700 border border-gray-600 cursor-pointer rounded-lg text-white hover:bg-gray-600 transition">
                        <i class="fa-solid fa-user-plus"></i> Registrarse
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-[#FF5252] text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
                        <i class="fa-solid fa-sign-in-alt"></i> Iniciar sesión
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

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
                <button id="btn-close-auth" class="btn btn-info">Cerrar</button>
              </form>
          
    
            <div class="modal-action m-0 p-0">
                <button type="button" id="submitFormAuth" class="btn btn-success">Registrarse</button>
            </div>
        </div>
    </div>
</dialog>


@endsection
