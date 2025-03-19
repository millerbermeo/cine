@extends('layouts.home')

@section('content')
<div>
    <div class="flex flex-col gap-5 my-3">

        <div class="top-0 sticky z-30 bg-white p-3 mb-2 rounded">
            <div class="flex justify-between items-end ">

                <h1 class="text-lg text-success">Peliculas</h1>
                <div class="flex justify-center gap-3">
                    <div class="relative flex gap-2">
                        <input type="text" id="fecha1" placeholder="Fecha 1" class="input min-w-24" />
                        <input type="text" id="fecha2" placeholder="Fecha 2" class="input min-w-24" />
                        <div class="badge badge-accent absolute -top-4 right-3">Enter</div>
                    </div>

                    <input type="text" id="searchInput" class="input input-bordered min-w-40"
                        placeholder="Buscar nombre, descripcion" />
                        <select id="categoryFilter" class="input input-bordered min-w-40" placeholder="Filtrar por categoría">
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
                        <div class="drawer-content">
                            <!-- Page content here -->
                            <label for="CarId" class="drawer-button btn btn-primary">
                                <i class="fas fa-shopping-cart"></i>
                            </label>
                        </div>
                    
                        <div class="drawer-side pr-4">
                            <label for="CarId" aria-label="close sidebar" class="drawer-overlay"></label>
                            <ul id="cartList" class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
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

    <dialog id="modal_confirmar_carrito" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold text-center mb-5">Confirmar Venta</h3>
            <div class="modal-action flex justify-center">
                <button id="btn-cerrar-carrito" class="btn btn-gray">Cancelar</button>
                <button id="btn-confirmar-carrito" class="btn btn-success text-white">Confirmar Venta</button>
            </div>
        </div>
    </dialog>
    
</div>
@endsection
