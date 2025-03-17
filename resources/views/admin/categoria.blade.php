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
            placeholder="Buscar categoría...">
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
    <table id="categoriasTable"
        class="table table-zebra overflow-hidden  text-left border-separate p-5 rounded-2xl bg-white">
        <thead class="bg-success text-sm text-white h-10">
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Fecha de Registro</th>
                <th>Editar</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody id="categoriaData"></tbody>
    </table>
</div>

<dialog id="id_modal_categoria" class="modal">
    <input id="categoriaId" type="hidden" />
    <div class="modal-box">
        <h3 id="modalTitle" class="text-lg font-bold text-center mb-5">Datos de Categoría</h3>
        <div>
            <div class="w-full flex justify-between">
                <fieldset class="fieldset w-full">
                    <legend class="fieldset-legend">Ingresar Nombre</legend>
                    <input id="nombre" type="text" class="input w-full" placeholder="Nombre" />
                    <p class="text-red-500" id="errorNombre"></p>
                </fieldset>
            </div>
        </div>

        <div class="modal-action">
            <button id="btn-close-modal" class="btn btn-info">Cerrar</button>
            <button id="submitFormCategoria" class="btn btn-success">Guardar</button>
        </div>
    </div>
</dialog>

<dialog id="modal_eliminar_categoria" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold text-center mb-5">Confirmar Eliminación</h3>
        <p class="text-center">¿Estás seguro de que deseas eliminar esta categoría?</p>
        <div class="modal-action flex justify-center">
            <button id="btn-cerrar-modal-eliminar" class="btn btn-gray">Cancelar</button>
            <button id="btn-confirmar-eliminar" class="btn btn-error text-white">Eliminar</button>
        </div>
    </div>
</dialog>

<div id="pagination" class="join w-full justify-end mt-4"></div>

@endsection
