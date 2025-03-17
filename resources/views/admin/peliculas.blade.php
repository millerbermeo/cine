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
            placeholder="Buscar película...">
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
    <table id="peliculasTable"
        class="table table-zebra overflow-hidden text-left border-separate p-5 rounded-2xl bg-white">
        <thead class="bg-success text-sm text-white h-10">
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Foto</th>
                <th>Año</th>
                <th>Trailer</th>
                <th>Editar</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody id="peliculaData"></tbody>
    </table>
</div>

<dialog id="id_modal_pelicula" class="modal">
    <input id="peliculaId" class="hidden" />
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 id="modalTitle" class="text-lg font-bold text-center mb-5">Datos Película</h3>
        <div>
            <div class="w-full flex justify-between">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Nombre</legend>
                    <input id="nombre" type="text" class="input" placeholder="Nombre" />
                    <p class="fieldset-label">Obligatorio</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Descripción</legend>
                    <input id="descripcion" type="text" class="input" placeholder="Descripción" />
                    <p class="fieldset-label">Opcional</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Seleccionar Categoría</legend>
                    <select id="categoria" class="select">
                        <option disabled selected>Selecciona una categoría</option>
                        <option>Acción</option>
                        <option>Aventura</option>
                        <option>Comedia</option>
                        <option>Drama</option>
                        <option>Romántica</option>
                    </select>
                    <p class="fieldset-label">Opcional</p>
                </fieldset>
            </div>

            <div class="w-full flex justify-between">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Año</legend>
                    <input id="year" type="text" class="input" placeholder="Año" />
                    <p class="fieldset-label">Obligatorio</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">URL del Trailer</legend>
                    <input id="trailer_url" type="text" class="input" placeholder="URL del Trailer" />
                    <p class="fieldset-label">Opcional</p>
                </fieldset>

                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Subir Foto</legend>
                    <input id="foto" type="file" class="input" />
                    <p class="fieldset-label">Opcional</p>
                </fieldset>
            </div>
        </div>
        <div class="flex items-start justify-end gap-5 mt-4">
            <button class="btn btn-info" id="btn-close-modal">Cancelar</button>

            <div class="modal-action m-0 p-0">
                <button id="submitFormPeli" type="submit" class="btn btn-success">Guardar</button>
            </div>
        </div>
    </div>
</dialog>

<dialog id="modal_eliminar_pelicula" class="modal">
    <div class="modal-box">
        <p class="py-4">¿Deseas Eliminar esta Película?</p>
   
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
