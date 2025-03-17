@extends('layouts.app')

@section('content')
<div>

    {{-- <div class="flex justify-between gap-5 my-5">
        <!-- Card 1: Total Películas -->
        <div
            class="w-full h-32 text-[#FF5252] bg-info mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">150</div>
                    <div class="text-lg">Total Películas</div>
                </div>
            </div>
        </div>

        <!-- Card 2: Películas Nuevas -->
        <div class="w-full h-32 bg-accent mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">30</div>
                    <div class="text-lg">Películas Nuevas</div>
                </div>
            </div>
        </div>

        <!-- Card 3: Vistas Hoy -->
        <div
            class="w-full h-32 text-[#ffffff] bg-success mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">120</div>
                    <div class="text-lg">Vistas Hoy</div>
                </div>
            </div>
        </div>

        <!-- Card 2: Películas Nuevas -->
        <div class="w-full h-32 bg-accent mb-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-around h-full text-gray-800">
                <div class="text-center text-[#ffffff]">
                    <div class="text-4xl font-bold">30</div>
                    <div class="text-lg">Películas Nuevas</div>
                </div>
            </div>
        </div>

    </div> --}}


    <div class="flex flex-col gap-5 my-3">



        {{--
        <!-- Featured Movie -->
        <div class="w-[600px]">
            <div class="relative rounded-lg overflow-hidden">
                <img class="w-full"
                    src="https://c4.wallpaperflare.com/wallpaper/621/286/348/keanu-reeves-keanu-reeves-parabellum-john-wick-john-wick-hd-wallpaper-preview.jpg"
                    alt="Featured Movie" class="w-full">
                <div class="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white w-full">
                    <h2 class="text-2xl font-semibold">BatBoy: Work From Home</h2>
                    <p>Action, Adventure, Comedy</p>
                </div>
                <button class="absolute bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-lg">Watch Now</button>
            </div>
        </div> --}}
        <!-- Continue Watching -->
        {{-- <div class="flex flex-col w-full">
            <h3 class="text-xl font-semibold mb-1">Continue Watching</h3>
            <div class="flex flex-col justify-between gap-4">
                <div class="bg-white p-3 rounded-lg shadow-md flex items-center gap-3">
                    <img src="https://c4.wallpaperflare.com/wallpaper/814/781/141/movie-john-wick-chapter-3-parabellum-keanu-reeves-hd-wallpaper-preview.jpg"
                        alt="Movie Thumbnail" class="w-24 rounded-lg">
                    <div>
                        <h4 class="text-lg font-semibold">James Bondary Ep. 4</h4>
                        <p class="text-gray-500">Action, Drama</p>
                        <div class="h-2 bg-gray-200 rounded-full mt-2">
                            <div class="h-2 bg-red-500 rounded-full" style="width: 69%;"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 rounded-lg shadow-md flex items-center gap-3">
                    <img src="https://c4.wallpaperflare.com/wallpaper/425/76/841/john-wick-john-wick-chapter-2-keanu-reeves-movies-wallpaper-preview.jpg"
                        alt="Movie Thumbnail" class="w-24 rounded-lg">
                    <div>
                        <h4 class="text-lg font-semibold">Slice of Life Ep. 4</h4>
                        <p class="text-gray-500">Slice of Life</p>
                        <div class="h-2 bg-gray-200 rounded-full mt-2">
                            <div class="h-2 bg-red-500 rounded-full" style="width: 69%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div> --}}

        <div id="peliculasContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"></div>
        <!-- Modal -->
        <dialog id="trailerModal" class="modal">
            <div class="modal-box w-11/12 max-w-5xl">

                <h2 class="text-xl font-semibold mb-4">Tráiler de la Película</h2>
                <div id="trailerContainer"></div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
              </form>
            
        </dialog>

    </div>

</div>


@endsection

<script>
    document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/get-peliculas");
        const peliculas = await response.json();
        console.log(peliculas);

        document.getElementById("peliculasContainer").innerHTML = peliculas
            .map(
                (pelicula) => `
                <div class="card card-side bg-base-100 shadow-sm">
                    <figure>
                        <img class="h-[150px] w-[120px] bg-white object-cover" src="storage/${pelicula.foto}" alt="${pelicula.nombre}" />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title">${pelicula.nombre}</h2>
                        <p>${pelicula.descripcion}</p>
                        <p>${pelicula.trailer_url}</p>
                        <div class="card-actions  justify-end">
                            <button class="btn text-white btn-success btntrailer" data-trailer-url="${pelicula.trailer_url}">Ver más</button>
                        </div>
                    </div>
                </div>
            `
            )
            .join("");

        // Delegar el evento click para los botones dinámicos
        document.getElementById('peliculasContainer').addEventListener('click', function(event) {
            if (event.target.classList.contains('btntrailer')) {
                const trailerUrl = event.target.getAttribute('data-trailer-url');
                showTrailer(trailerUrl);
            }
        });

    } catch (error) {
        console.error("Error al obtener las películas:", error);
    }

    // Función para abrir el modal y mostrar el tráiler
    function showTrailer(url) {
        trailerModal.showModal();
        const trailerContainer = document.getElementById('trailerContainer');
        const iframe = `  <iframe  src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        trailerContainer.innerHTML = iframe;
        document.getElementById('trailerModal').classList.add('modal-open');
      
    }

    // Función para extraer el ID del video de la URL de YouTube
 
    // Función para cerrar el modal
    function closeModal() {
    const trailerModal = document.getElementById('trailerModal');
    trailerModal.close(); // Cierra el modal
    const trailerContainer = document.getElementById('trailerContainer');
    trailerContainer.innerHTML = ''; // Limpia el contenido del tráiler
}
});

</script>