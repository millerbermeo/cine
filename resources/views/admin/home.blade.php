@extends('layouts.home')

@section('content')
<div>
    <div id="descargando" class="fixed hidden w-full flex-col gap-4 h-screen bg-black/60 sdssd top-0 left-0 z-50  justify-center items-center">
        <div class="flex flex-col justify-center items-center gap-4 h-full w-full">
            <span class="loading loading-spinner text-info w-20"></span>

        <span class="text-2xl text-white">
            Descargando Registros...

        </span>
        </div>
    </div>
    <div class="flex flex-col gap-5 my-3">

        <div class="top-0 sticky z-30 bg-white p-3 mb-2 rounded">
            <div class="flex justify-between items-end ">
                {{--
                <h1 class="text-lg text-success mr-5">Peliculas</h1> --}}
                <div class="flex justify-center gap-3">
                    <div class="relative flex gap-2">
                        <input type="text" id="fecha1" placeholder="Fecha 1" class="input min-w-24" />
                        <input type="text" id="fecha2" placeholder="Fecha 2" class="input min-w-24" />
                        <div class="badge badge-accent absolute -top-4 right-3">Enter</div>
                    </div>

                    <div class="relative flex gap-2">
                        <input id="precioMin" type="number" class="input min-w-24" placeholder="Precio mínimo">
                        <input id="precioMax" type="number" class="input min-w-24" placeholder="Precio máximo">
                        <div class="badge badge-accent absolute -top-4 right-3">Enter</div>
                    </div>

                    <input type="text" id="searchInput" class="input input-bordered min-w-40"
                        placeholder="Buscar nombre, descripcion" />
                    <select id="categoryFilter" class="input input-bordered min-w-40"
                        placeholder="Filtrar por categoría">
                        <option value="">Seleccionar categoría</option>
                    </select>

                    <div>
                        <button id="BtnExcell" class="btn btn-success"><i class="fas fa-download"></i>
                            Excell</button>
                    </div>
                    <div>
                        <button id="BtnClear" class="btn btn-warning">Limpiar</button>
                    </div>

                    <div class="drawer drawer-end w-20">
                        <input id="CarId" type="checkbox" class="drawer-toggle" />
                        <div class="drawer-content relative">
                            <!-- Page content here -->
                            <label for="CarId" class="drawer-button btn btn-primary">
                                <i class="fas fa-shopping-cart"></i>
                            </label>
                            <div id="CantidadItems" class="badge badge-success absolute -top-3 right-1 text-xs"></div>

                        </div>

                        <div class="drawer-side pr-4">
                            <label for="CarId" aria-label="close sidebar" class="drawer-overlay"></label>
                            <ul id="cartList" class="menu bg-base-200 text-base-content min-h-full w-80 p-4 py-10">
                                <!-- Dynamic list content will be added here -->
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <div class="w-full h-[1px] bg-success mt-2"></div>
        </div>


        <div id="peliculasContainer"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 px-0.5"></div>

        <!-- Modal -->
        <dialog id="trailerModal" class="modal">
            <div class="modal-box w-11/12 max-w-2xl ">
                <h2 class="text-xl font-semibold mb-4">Tráiler de la Película</h2>
                <div id="trailerContainer"></div>
                <form class=" " method="dialog" class="modal-backdrop">
                    <button class="text-3xl absolute top-2 right-2 btn-info btn rounded-full">x</button>
                </form>
            </div>
        </dialog>

        <!-- Botón Cargar más -->
        <div class="flex justify-center mt-5 fixed bottom-10 left-0 right-0">
            <button id="loadMoreBtn" class="btn btn-success btn-circle scale-150 text-white">Más</button>
        </div>

        <div id="loader" class="flex justify-center items-center fixed bottom-10 right-10">
            <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-success"
                role="status">

            </div>
        </div>
    </div>

 
    <div id="modal_confirmar_carrito" class="fixed hidden w-full flex-col gap-4 h-screen bg-black/60 top-0 left-0 z-50 justify-center items-center">
        <div class="w-[70%] p-6 rounded-xl items-start flex gap-10 bg-white shadow-lg">
    
            <div class="w-full">
                <div class="flex justify-between gap-3 mb-4 flex-wrap">
                    <button id="btn-buscar-cliente" class="btn btn-info w-full text-white ">Buscar Cliente</button>
                    <button id="btn-registrar-cliente" class="btn btn-outline btn-success w-full">Registrar Cliente</button>
                </div>
        
                <!-- Formulario para mostrar los datos del cliente -->
                <div id="form_cliente" class="hidden">
                    <h4 class="font-normal text-lg mb-4 text-center">Detalles del Cliente</h4>
                    <div class="divider divide-black">

                    </div>
                    <form id="clienteForm">
                        <div class="mb-4 w-full">
                            <label for="cliente_select" class="block text-sm font-medium text-gray-700">Buscar Cliente</label>
                            <select id="cliente_select" class="select select-bordered min-w-full w-full focus:ring-primary">
                                <option value="">Selecciona un cliente...</option>
                                <!-- Los clientes se cargarán dinámicamente aquí -->
                            </select>
                        </div>
        
                        <div class="mb-4">
                            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" id="nombre" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_nombre" class="text-red-500 text-sm hidden"></p>
                        </div>
                        <div class="mb-4">
                            <label for="tipo_documento" class="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                            <input type="text" id="tipo_documento" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_tipo_documento" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="numero_documento" class="block text-sm font-medium text-gray-700">Número de Documento</label>
                            <input type="text" id="numero_documento" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_numero_documento" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" id="email" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_email" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="text" id="telefono" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_telefono" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <button type="submit" class="btn btn-outline btn-info w-full">Actulizar Datos</button>

                    </form>
                </div>
        
                <!-- Formulario para crear un nuevo cliente -->
                <div id="crear_cliente" class="hidden">
                    <h4 class="font-normal text-lg mb-4 text-center">Registrar Nuevo Cliente</h4>
                    <div class="divider divide-black"> </div>
                    <form id="nuevoClienteForm">
                        <div class="mb-4">
                            <label for="nombre_nuevo" class="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" id="nombre_nuevo" class="input input-bordered w-full bg-base-200 rounded-lg p-2 focus:ring-primary">
                            <p id="error_nombre" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="tipo_documento_nuevo" class="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                            <input type="text" id="tipo_documento_nuevo" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_tipo_documento" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="numero_documento_nuevo" class="block text-sm font-medium text-gray-700">Número de Documento</label>
                            <input type="text" id="numero_documento_nuevo" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_numero_documento" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="email_nuevo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" id="email_nuevo" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_email" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <div class="mb-4">
                            <label for="telefono_nuevo" class="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="text" id="telefono_nuevo" class="input input-bordered w-full rounded-lg p-2 focus:ring-primary">
                            <p id="error_telefono" class="text-red-500 text-sm hidden"></p>

                        </div>
                        <button type="submit" class="btn btn-outline btn-info w-full">Registrar Cliente</button>
                    </form>
                </div>
        
                {{-- <div class="modal-action flex justify-center gap-4 mt-5">
                    <button id="btn-cerrar-carrito" class="btn btn-outline btn-gray" onclick="cerrarModal()">Cancelar</button>
                    <button id="btn-confirmar-carrito" class="btn btn-success text-white w-full md:w-auto">Confirmar Venta</button>
                </div> --}}
            </div>



            <div class="w-full">
                <div id="DatosPrevios" class="w-full">

                </div>

                <div class="modal-action flex justify-end gap-4 mt-5 w-full">
                    <button type="button" id="btn-cerrar-carrito" class="btn btn-outline btn-gray" onclick="cerrarModal()">Cancelar</button>
                    <button type="button" id="btn-confirmar-carrito" class="btn btn-success text-white w-full md:w-auto">Confirmar Venta</button>
                </div>
            </div>


        </div>
    </div>
    
    
    
    
    
    

</div>
@endsection


