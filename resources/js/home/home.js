document.addEventListener("DOMContentLoaded", async function () {
    let currentPage = 1;
    let allPeliculas = []; // Array para almacenar todas las películas cargadas
    const peliculasContainer = document.getElementById("peliculasContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loader = document.getElementById("loader");
    const searchInput = document.getElementById("searchInput");
    const btnClear = document.getElementById("BtnClear");
    const fecha1Input = document.getElementById("fecha1");
    const fecha2Input = document.getElementById("fecha2");

    async function fetchPeliculas(page, fecha1 = "", fecha2 = "") {
        try {
            loader.classList.remove("hidden");

            let url = `/get-peliculas?page=${page}`;
            if (fecha1 && fecha2) {
                url += `&fecha1=${fecha1}&fecha2=${fecha2}`;
            }

            const response = await fetch(url);
            const peliculas = await response.json();

            if (page === 1) allPeliculas = []; // Si es la primera página, reiniciamos la lista

            allPeliculas = [...allPeliculas, ...peliculas.data];
            updatePeliculas(allPeliculas);

            // Desplazar hacia el último elemento agregado
            const lastElement = peliculasContainer.lastElementChild;
            if (lastElement) {
                lastElement.scrollIntoView({ behavior: "smooth" });
            }

            // Controlar la visibilidad del botón de carga
            if (!peliculas.next_page_url) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = "Fin";
            } else {
                loadMoreBtn.disabled = false;
                loadMoreBtn.textContent = "Mas";
            }
        } catch (error) {
            console.error("Error al obtener las películas:", error);
        } finally {
            loader.classList.add("hidden");
        }
    }

    // Evento para cargar más películas
    loadMoreBtn.addEventListener("click", () => {
        currentPage++;
        fetchPeliculas(currentPage, fecha1Input.value, fecha2Input.value);
    });

    // Evento para filtrar por fechas cuando cambian los inputs
    function applyFilters() {
        currentPage = 1; // Reiniciar la paginación
        fetchPeliculas(currentPage, fecha1Input.value, fecha2Input.value);
    }

    fecha1Input.addEventListener("change", applyFilters);
    fecha2Input.addEventListener("change", applyFilters);

    // Filtrar por búsqueda en tiempo real
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

    // Limpiar búsqueda
    btnClear.addEventListener("click", () => {
        searchInput.value = "";
        fecha1Input.value = ""
        fecha2Input.value = ""
        fetchPeliculas(1)
        updatePeliculas(allPeliculas);
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
                       <p class="text-success font-bold text-xs">${pelicula.year}</p>
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
        document.getElementById("trailerContainer").innerHTML = "";
    }

    // Mostrar tráiler cuando se hace clic en el botón
    peliculasContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("btntrailer")) {
            const trailerUrl = event.target.getAttribute("data-trailer-url");
            showTrailer(trailerUrl);
        }
    });

    // Cargar las películas al iniciar la página
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
