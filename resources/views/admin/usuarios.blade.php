@extends('layouts.app')

@section('content')
<div class="flex justify-between items-center mb-2">
    <label class="input flex items-center border outline-none rounded-md px-3 py-2 bg-gray-50">
        <svg class="h-4 w-4 opacity-50 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input type="search" id="searchInput" class="outline-none bg-transparent text-sm"
            placeholder="Buscar usuario...">
    </label>

    <div class="flex gap-2.5">
        <select id="limitSelect" class="border px-3 py-2 rounded-md select w-36">
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
        </select>

        <button id="btn-open-modal"
            class="btn btn-active text-xl w-36 font-medium btn-info text-white">Registrar</button>
    </div>

</div>

<div class="overflow-x-auto w-full">
    <table id="usersTable"
        class="table table-zebra overflow-hidden  text-left border-separate p-5 rounded-2xl bg-white">
        <thead class="bg-success text-sm text-white h-10">
            <tr>
                {{-- <th class="px-0.5 m-0.5 pl-3">Id</th> --}}
                <th class="px-0.5 m-0.5 pl-3">Nombre</th>
                <th class="px-0.5 m-0.5 pl-3">Apellido</th>
                <th class="px-0.5 m-0.5 pl-3">Correo</th>
                <th class="px-0.5 m-0.5 pl-3">Identificación</th>
                <th class="px-0.5 m-0.5 pl-3">Edad</th>
                <th class="px-0.5 m-0.5 pl-3">Teléfono</th>
                <th class="px-0.5 m-0.5 pl-3">Dirección</th>
                <th class="px-0.5 m-0.5 pl-3">Sexo</th>
                <th class="px-0.5 m-0.5 pl-3">Nacionalidad</th>
                <th class="px-0.5 m-0.5 pl-3">Estado</th>
                <th class="px-0.5 m-0.5 pl-3 hidden">Foto</th>
                <th class="px-0.5 m-0.5 pl-3 hidden">Fecha</th>
                <th class="px-0.5 m-0.5 pl-3">Acciones</th>
            </tr>
        </thead>
        <tbody id="userData"></tbody>
    </table>
</div>

<dialog id="id_modal_usuario" class="modal">
    <input id="userId" type="hidden" />
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 id="modalTitle" class="text-lg font-bold text-center mb-5">Datos Personales</h3>
        <div>
            <div class="w-full flex justify-between">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Nombre</legend>
                    <input id="nombre" type="text" class="input" placeholder="Nombre" />
                    <p class="fieldset-label" id="nombreError">Obligatorio</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Apellido</legend>
                    <input id="apellido" type="text" class="input" placeholder="Apellido" />
                    <p class="fieldset-label" id="apellidoError">Obligatorio</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Identificacion</legend>
                    <input id="identificacion" type="text" class="input" placeholder="Identificacion" />
                    <p class="fieldset-label" id="identificacionError">Obligatorio</p>
                </fieldset>
            </div>

            <div class="w-full flex justify-between">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Email</legend>
                    <input id="email" type="text" class="input" placeholder="Email" />
                    <p class="fieldset-label" id="emailError">Obligatorio</p>
                </fieldset>
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Telefono</legend>
                    <input id="telefono" type="text" class="input" placeholder="Telefono" />
                    <p class="fieldset-label" id="telefonoError">Obligatorio</p>
                    <p class="fieldset-label" id="TelefonoErrorCantidad"></p>
                </fieldset>
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Edad</legend>
                    <input id="edad" type="text" class="input" placeholder="Edad" />
                    <p class="fieldset-label" id="edadError">Obligatorio</p>
                    <p class="fieldset-label" id="EdadErrorCantidad"></p>
                </fieldset>
            </div>

            <div class="w-full flex justify-between gap-3">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Direccion</legend>
                    <input id="direccion" type="text" class="input" placeholder="Direccion" />
                    <p class="fieldset-label">Opcional</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Sexo</legend>
                    <select id="sexoSelect" class="select">
                        <option disabled selected>Selecciona un sexo</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                    <span class="fieldset-label">Opcional</span>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Nacionalidad</legend>
                    <select id="nacionalidadSelect" class="select">
                        <option disabled selected>Selecciona una nacionalidad</option>
                        <option>Colombia</option>
                        <option>Brasil</option>
                        <option>Argentina</option>
                        <option>Canada</option>
                        <option>Chile</option>
                        <option>Italia</option>
                        <option>Rusia</option>
                    </select>
                    <span class="fieldset-label">Opcional</span>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Contraseña</legend>
                    <input id="password" type="password" class="input" placeholder="Contraseña" />
                    <p class="fieldset-label">Obligatorio</p>
                </fieldset>
            </div>

        </div>
        <div class="flex items-start justify-end gap-5 mt-4">

            <button class="btn 	btn-info" id="btn-close-modal">Cancelar</button>

            <div class="modal-action m-0 p-0">
                <button id="submitForm" type="submit" class="btn btn-success">Guardar</button>
            </div>
        </div>
    </div>
</dialog>



<dialog id="modal_eliminar_usuario" class="modal">
    <div class="modal-box">
        <p class="py-4">Deseas Eliminar este Usuario?</p>
   
    <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button, it will close the modal -->
          <button class="btn btn-info">Cancelar</button>
        </form>

        <button id="btn-confirmar-eliminar" class="btn btn-success">Confirmar</button>

      </div>

      <div>
</dialog>

<div id="pagination" class="join w-full justify-end mt-4"></div>


@endsection