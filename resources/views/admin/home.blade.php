@extends('layouts.app')

@section('content')
<div>
    <div class="flex flex-col gap-5 my-3">

        <div id="peliculasContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"></div>
        <!-- Modal -->
        <dialog id="trailerModal" class="modal">
            <div class="modal-box w-11/12 max-w-2xl ">

                <h2 class="text-xl font-semibold mb-4">Tráiler de la Película</h2>
                <div   id="trailerContainer"></div>
                <form class=" " method="dialog" class="modal-backdrop">
                    <button class="text-3xl absolute top-2 right-2 btn-info btn rounded-full">x</button>
                  </form>
            </div>
         
            
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
                        <p class="hidden">${pelicula.trailer_url}</p>
                        <div class="card-actions  justify-end">
                            <button class="btn text-white btn-success btntrailer" data-id="${pelicula.id}" data-nombre="${pelicula.nombre}" data-descripcion="${pelicula.descripcion}" data-categoria="${pelicula.categoria}" data-year="${pelicula.year}" data-foto="storage/${pelicula.foto}" data-trailer-url="${pelicula.trailer_url}">Ver más</button>
                        </div>
                    </div>
                </div>
            `
            )
            .join("");


        document.getElementById('peliculasContainer').addEventListener('click', function(event) {
            if (event.target.classList.contains('btntrailer')) {
                const trailerUrl = event.target.getAttribute('data-trailer-url');
                showTrailer(trailerUrl);
            }
        });

    } catch (error) {
        console.error("Error al obtener las películas:", error);
    }

    function showTrailer(url) {
        trailerModal.showModal();
        
        const trailerContainer = document.getElementById('trailerContainer');
        const iframe = `  <iframe class="mx-auto" width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
        trailerContainer.innerHTML = iframe;
      
    }

    function closeModal() {

    document.getElementById("trailerModal").close();
    const trailerContainer = document.getElementById('trailerContainer');
    trailerContainer.innerHTML = ''; // Limpia el contenido del tráiler
}
});

</script>