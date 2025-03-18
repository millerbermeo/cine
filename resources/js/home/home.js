document.addEventListener("DOMContentLoaded", async function () {
    let currentPage = 1;
    const peliculasContainer = document.getElementById("peliculasContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("searchInput");
    const btnClear = document.getElementById("BtnClear");
    let allPeliculas = []; // Array para almacenar todas las películas cargadas

    async function fetchPeliculas(page) {
        try {
            loader.classList.remove("hidden");

            const response = await fetch(`/get-peliculas?page=${page}`);
            const peliculas = await response.json();

            allPeliculas = [...allPeliculas, ...peliculas.data]; // Guardamos todas las películas cargadas
            updatePeliculas(allPeliculas);
            const container = document.getElementById("peliculasContainer");
            const lastElement = container.lastElementChild;
            if (lastElement) {
                lastElement.scrollIntoView({ behavior: "smooth" });
            }

            if (!peliculas.next_page_url) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = "Fin";
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
        const filteredPeliculas = allPeliculas.filter(
            (pelicula) =>
                pelicula.nombre.toLowerCase().includes(searchTerm) ||
                pelicula.categoria.toLowerCase().includes(searchTerm) ||
                pelicula.descripcion.toLowerCase().includes(searchTerm) ||
                pelicula.year.toLowerCase().includes(searchTerm)
        );
        updatePeliculas(filteredPeliculas);
    });

    btnClear.addEventListener("click", () => {
        searchInput.value = ""; // Limpiar el input de búsqueda
        updatePeliculas(allPeliculas); // Restaurar la lista original de películas
    });

    function updatePeliculas(filteredPeliculas) {
        peliculasContainer.innerHTML = filteredPeliculas
            .map(
                (pelicula) => `
            <div class="card card-side border-gray-300 border bg-base-100 shadow max-h-[130px] duration-500 transition-all">
                <figure>
                    <img class="${
                        pelicula.foto ? "" : "hidden"
                    } w-[120px] bg-white object-fill h-full" src="storage/${
                    pelicula.foto
                }" />
                </figure>
                <div class="card-body p-2">
                    <h2 class="card-title uppercase">${pelicula.nombre}</h2>
                    <p class="text-gray-400 text-xs">${pelicula.descripcion}</p>
                    <div class="card-actions justify-end">
                        <button class="text-lg underline text-success btntrailer" data-trailer-url="${
                            pelicula.trailer_url
                        }">Ver más</button>
                    </div>
                </div>
            </div>
        `
            )
            .join("");
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
        const trailerContainer = document.getElementById("trailerContainer");
        const iframe = `
                <iframe class="mx-auto" width="560" height="315" src="${url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            `;
        trailerContainer.innerHTML = iframe;
    }

    function closeModal() {
        document.getElementById("trailerModal").close();
        const trailerContainer = document.getElementById("trailerContainer");
        trailerContainer.innerHTML = ""; // Limpia el contenido del tráiler
    }

    // Mostrar tráiler cuando se hace clic en el botón
    peliculasContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("btntrailer")) {
            const trailerUrl = event.target.getAttribute("data-trailer-url");
            showTrailer(trailerUrl);
        }
    });
    
});
