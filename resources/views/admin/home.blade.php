@extends('layouts.home')

@section('content')
<div>
    <div class="flex flex-col gap-5 my-3">

        <div class="top-0 sticky z-30 bg-white p-3 mb-2 rounded">
            <div class="flex justify-between items-end ">

                <h1 class="text-2xl text-success">Listado de Peliculas</h1>
                <div class="flex justify-center gap-3">
                    <input type="text" id="fecha1" placeholder="Fecha 1" class="input max-w-24" />
                    <input type="text" id="fecha2" placeholder="Fecha 2" class="input max-w-24" />
                    <input type="text" id="searchInput" class="input input-bordered min-w-80"
                        placeholder="Buscar nombre, categoria, descripcion, año..." />
                        <div>
                            <button id="BtnExcell" class="btn btn-success">Excell</button>
                        </div>
                    <div>
                        <button id="BtnClear" class="btn btn-warning">Limpiar</button>
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
</div>
@endsection

{{-- <script>
    document.addEventListener("DOMContentLoaded", async function () {
        let currentPage = 1;
    const peliculasContainer = document.getElementById("peliculasContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("searchInput");
    let allPeliculas = []; // Array para almacenar todas las películas cargadas

    async function fetchPeliculas(page) {
        try {
            loader.classList.remove("hidden");

            const response = await fetch(`/get-peliculas?page=${page}`);
            const peliculas = await response.json();
            
            allPeliculas = [...allPeliculas, ...peliculas.data]; // Guardamos todas las películas cargadas
            updatePeliculas(allPeliculas); 
            const container = document.getElementById('peliculasContainer'); 
            const lastElement = container.lastElementChild; 
            if (lastElement) {
                lastElement.scrollIntoView({ behavior: 'smooth' }); 
            }

            if (!peliculas.next_page_url) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = 'Fin';
            }
        } catch (error) {
            console.error("Error al obtener las películas:", error);
        } finally {
            loader.classList.add("hidden");
        }
    }

     // Filtrar películas en función del término de búsqueda
     searchInput.addEventListener("input", (event) => {


        const searchTerm = event.target.value.toLowerCase();
        const filteredPeliculas = allPeliculas.filter(pelicula => 
            pelicula.nombre.toLowerCase().includes(searchTerm) ||
            pelicula.categoria.toLowerCase().includes(searchTerm)||
            pelicula.descripcion.toLowerCase().includes(searchTerm)||
            pelicula.year.toLowerCase().includes(searchTerm)
            
        );
        updatePeliculas(filteredPeliculas);
    });

    function updatePeliculas(filteredPeliculas) {
        peliculasContainer.innerHTML = filteredPeliculas.map(pelicula => `
            <div class="card card-side border-gray-300 border bg-base-100 shadow max-h-[130px] duration-500 transition-all">
                <figure>
                    <img class="${pelicula.foto ? '' : 'hidden'} w-[120px] bg-white object-fill h-full" src="storage/${pelicula.foto}" />
                </figure>
                <div class="card-body p-2">
                    <h2 class="card-title uppercase">${pelicula.nombre}</h2>
                    <p class="text-gray-400 text-xs">${pelicula.descripcion}</p>
                    <div class="card-actions justify-end">
                        <button class="text-lg underline text-success btntrailer" data-trailer-url="${pelicula.trailer_url}">Ver más</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

   

    // Cargar más películas
    loadMoreBtn.addEventListener("click", () => {
        currentPage++;
        fetchPeliculas(currentPage);
    });

    fetchPeliculas(currentPage);

        // Mostrar tráiler
        function showTrailer(url) {
            trailerModal.showModal();
            const trailerContainer = document.getElementById('trailerContainer');
            const iframe = `
                <iframe class="mx-auto" width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            `;
            trailerContainer.innerHTML = iframe;
        }

        function closeModal() {
            document.getElementById("trailerModal").close();
            const trailerContainer = document.getElementById('trailerContainer');
            trailerContainer.innerHTML = ''; // Limpia el contenido del tráiler
        }

        // Mostrar tráiler cuando se hace clic en el botón
        peliculasContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('btntrailer')) {
                const trailerUrl = event.target.getAttribute('data-trailer-url');
                showTrailer(trailerUrl);
            }
        });


  
    });
</script> --}}