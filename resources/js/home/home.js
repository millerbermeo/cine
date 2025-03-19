import { showToast } from "../toast";

document.addEventListener("DOMContentLoaded", async function () {
    listarCategoriasSelect()
    let currentPage = 1;
    let allPeliculas = []; // Array para almacenar todas las películas cargadas
    const peliculasContainer = document.getElementById("peliculasContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loader = document.getElementById("loader");
    const btnClear = document.getElementById("BtnClear");
    const searchInput = document.getElementById("searchInput");
    const fecha1Input = document.getElementById("fecha1");
    const fecha2Input = document.getElementById("fecha2");
    const categoryFilter = document.getElementById("categoryFilter");


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
    
            // Si hay un término de búsqueda, aplicar el filtro antes de actualizar la UI
            const searchTerm = searchInput.value.toLowerCase().trim();
            const category = categoryFilter.value.toLowerCase().trim();

            if (searchTerm || category) {
                const filteredPeliculas = filtrarPeliculas(allPeliculas, searchTerm, category);
                updatePeliculas(filteredPeliculas);
            } else {
                updatePeliculas(allPeliculas);
            }


    
            // Desplazar al último elemento
            const lastElement = peliculasContainer.lastElementChild;
            if (lastElement) {
                lastElement.scrollIntoView({ behavior: "smooth" });
            }
    
            // Controlar la visibilidad del botón de carga
            loadMoreBtn.disabled = !peliculas.next_page_url;
            loadMoreBtn.textContent = peliculas.next_page_url ? "Mas" : "Fin";
    
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
    categoryFilter.addEventListener("change", applyFilters);

    // Filtrar por búsqueda en tiempo real
    function filtrarPeliculas(peliculas, searchTerm, category) {
        const searchWords = searchTerm ? searchTerm.split(/\s+/) : [];
    
        return peliculas.filter((pelicula) => {
            const nombre = pelicula.nombre?.toLowerCase() || "";
            const categoria = pelicula.categoria?.toLowerCase() || "";
            const descripcion = pelicula.descripcion?.toLowerCase()
    
            const matchesSearchTerm = searchWords.every(word =>
                nombre.includes(word) ||
                descripcion.includes(word)
            );
    
            // Filtra por categoría si se especifica
            const matchesCategory = category ? categoria.includes(category.toLowerCase()) : true;
    
            return matchesSearchTerm && matchesCategory;
        });
    }
    
    // Evento de búsqueda
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            const filteredPeliculas = filtrarPeliculas(allPeliculas, searchTerm);
            updatePeliculas(filteredPeliculas);
        } else {
            updatePeliculas(allPeliculas);
        }
    });

    // Limpiar búsqueda
    btnClear.addEventListener("click", () => {
        searchInput.value = "";
        fecha1Input.value = ""
        fecha2Input.value = ""
        categoryFilter.value = ""
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
                 <div class="flex gap-3 relative justify-between items-center w-full"><h2 class="card-title uppercase">${pelicula.nombre}</h2> <p class="text-gray-400 uppercase font-bold text-xs absolute top-0 right-1">${pelicula.precio}</p></div>
                    
                    <p class="text-gray-400 text-xs">${pelicula.descripcion.split(" ")[0]}</p>
                       <div class="flex gap-2 justify-between w-full">
                        <p class="text-gray-400 uppercase font-bold text-xs">${pelicula.categoria}</p>
                        <p class="text-success font-bold text-xs">${pelicula.year}</p>
                       </div>
                    <div class="card-actions justify-between">
                    <button class="btnCar text-sm btn-info btn rounded-full w-8 h-8 text-white" data-pelicula='${JSON.stringify(pelicula)}'>Add</button>
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

 // Cambiar el id del botón BtnCar a una clase común como 'btnCar'
 peliculasContainer.addEventListener("click", function (event) {
   
    if (event.target.classList.contains("btnCar")) {
        const peliculaData = event.target.getAttribute("data-pelicula");
        const pelicula = JSON.parse(peliculaData);  // Convierte el string JSON de vuelta a objeto

        // Almacena la película en localStorage
        let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || []; // Obtener el carrito, o un array vacío si no existe
        peliculasEnCarrito.push(pelicula); // Agregar la nueva película
        localStorage.setItem("peliculasCarrito", JSON.stringify(peliculasEnCarrito)); // Guardar el carrito actualizado
        cargarCarrito()
        showToast("Película añadida al carrito", "success");
    }
});


document.getElementById("BtnExcell").addEventListener("click", async function () {
    const searchInput = document.getElementById("searchInput");  // Asegúrate de que este ID exista en el HTML
    const fecha1Input = document.getElementById("fecha1");  // Asegúrate de que este ID exista en el HTML
    const fecha2Input = document.getElementById("fecha2");  // Asegúrate de que este ID exista en el HTML
    const categoryFilter = document.getElementById("categoryFilter");

    const searchTerm = searchInput.value.trim().toLowerCase();
    const fecha1 = fecha1Input.value;
    const fecha2 = fecha2Input.value;
    const categoria = categoryFilter.value;  // Capturamos el valor de la categoría



    let page = 1;
    let peliculas = [];
    let totalPeliculas = 0;
    let totalPages = 1;  // Comenzamos con 1 página

    try {
        let url = `/get-peliculas?export=true&page=${page}`;

        if (searchTerm) {
            url += `&search=${searchTerm}`;
        }
        if (fecha1 && fecha2) {
            url += `&fecha1=${fecha1}&fecha2=${fecha2}`;
        }

        if (categoria) {  // Añadimos la categoría seleccionada a la URL
            url += `&categoria=${categoria}`;
        }

        while (page <= totalPages) {
            const response = await fetch(url);
            const data = await response.json();

            if (data.data) {
                peliculas = peliculas.concat(data.data); // Agregar películas del lote actual
                totalPages = data.last_page; // Número total de páginas
                page++; // Incrementamos la página
                url = `/get-peliculas?export=true&page=${page}&categoria=${categoria}`;            } else {
                showToast("No hay más datos para exportar.");
                break;
            }
        }

        if (!peliculas || peliculas.length === 0) {
            showToast("No hay datos para exportar.");
            return;
        }

        let archivos = [];

        // Generar los archivos Excel por lotes de 50
        for (let i = 0; i < peliculas.length; i += 50) {
            const batch = peliculas.slice(i, i + 50);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Películas");

            worksheet.addRow(["Nombre", "Categoría", "Descripción", "Año"]);

            batch.forEach((pelicula) => {
                worksheet.addRow([pelicula.nombre, pelicula.categoria, pelicula.descripcion, pelicula.year]);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            archivos.push({
                blob,
                nombre: `Peliculas_Lote_${Math.floor(i / 50) + 1}.xlsx`,
            });
        }

        // Descargar los archivos generados
     // Descargar los archivos generados con un retraso entre cada descarga
archivos.forEach((archivo, index) => {
    setTimeout(() => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(archivo.blob);
        a.download = archivo.nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, index * 1000); // Retraso de 1 segundo entre descargas
});

    } catch (error) {
        console.error("Error al exportar las películas:", error);
        showToast("Hubo un error al exportar las películas.");
    }
});



function cargarCarrito() {
    const peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
    const cartList = document.getElementById("cartList");

    // Limpiar la lista actual
    cartList.innerHTML = "";

    if (peliculasEnCarrito.length === 0) {
        cartList.innerHTML = "<li><p>No hay películas en el carrito</p></li>";
    } else {
        // Agrupar las películas por ID y sumar los precios
        const peliculasAgrupadas = peliculasEnCarrito.reduce((acc, pelicula) => {
            if (!acc[pelicula.id]) {
                acc[pelicula.id] = { ...pelicula, cantidad: 0 };
            }
            acc[pelicula.id].cantidad++;
            acc[pelicula.id].precioTotal = acc[pelicula.id].precio * acc[pelicula.id].cantidad;
            return acc;
        }, {});

        let totalCarrito = 0;
        Object.values(peliculasAgrupadas).forEach(pelicula => {
            const li = document.createElement("div");
            li.classList.add("card", "card-side", "border-gray-300", "border-b-[1px]", "bg-white", "mb-2", "p-1", "rounded-none");
            li.innerHTML = `
                <figure><img class="w-[50px] h-[50px]  object-cover rounded-full" src="storage/${pelicula.foto}" alt="${pelicula.nombre}" /></figure>
                <div class="card-body p-2">
                    <h2 class="card-title text-xs uppercase">${pelicula.nombre}</h2>
                    <p class="text-black font-normal text-xs">${pelicula.precio} X ${pelicula.cantidad}</p>
                    <div class="flex gap-2 justify-between w-full">
                        <p class="text-gray-400 uppercase font-italic text-xs">${pelicula.categoria}</p>
                        <p class="text-success font-bold text-xs">${pelicula.year}</p>
                    </div>
                    <div class="card-actions justify-between">
                        <button class="absolute rounded-full -top-1 text-white w-5 cursor-pointer h-5 bg-error right-2 btn-lg btn-danger btn-outline eliminar-btn" data-id="${pelicula.nombre}">X</button>
                    </div>
                </div>
            `;
            cartList.appendChild(li);
            totalCarrito += pelicula.precioTotal;
        });

        // Mostrar el total
        const totalElement = document.createElement("div");
        totalElement.classList.add("text-right", "font-normal", "text-xl", "mt-4");
        totalElement.innerHTML = `Total: $${totalCarrito}`;
        cartList.appendChild(totalElement);

        // Crear el botón para abrir el modal
        const btnAbrirModal = document.createElement("button");
        btnAbrirModal.classList.add("btn", "btn-primary", "mt-4");
        btnAbrirModal.innerHTML = "Confirmar Venta";
        cartList.appendChild(btnAbrirModal);

        // Abrir el modal
        btnAbrirModal.addEventListener('click', () => {
            abrirModal();
        });

        // Eliminar película del carrito
        const eliminarBtns = document.querySelectorAll('.eliminar-btn');
        eliminarBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                eliminarDelCarrito(id);
            });
        });
    }
}
    
    // Función para eliminar una película del carrito
    function eliminarDelCarrito(nombre) {
        let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
        peliculasEnCarrito = peliculasEnCarrito.filter(pelicula => pelicula.nombre !== nombre);
        localStorage.setItem("peliculasCarrito", JSON.stringify(peliculasEnCarrito));
        cargarCarrito(); // Recargar el carrito
    }
    
    // Cargar el carrito cuando la página se cargue
    window.onload = cargarCarrito;


    function listarCategoriasSelect() {
        fetch("/get-categorias")
            .then((response) => response.json())
            .then((data) => {
                const selectCategoria = document.getElementById("categoryFilter");
        
                // Limpiar el select antes de agregar nuevas opciones
                selectCategoria.innerHTML = "<option value=''>Seleccionar categoría</option>";
        
                // Agregar nuevas opciones dinámicamente
                data.filter((categoria) => categoria.estado == 1).forEach((categoria) => {
                    const option = document.createElement("option");
                    option.value = categoria.nombre;  // Usar el ID de la categoría como valor
                    option.textContent = categoria.nombre; // Nombre de la categoría
                    selectCategoria.appendChild(option);
                });
            })
            .catch((error) => console.error("Error al obtener categorías:", error));
    }
    
    // Llamar a la función cuando se cargue la página o se necesite
    listarCategoriasSelect();
    
    

    // Función para abrir el modal
function abrirModal() {
    const modal = document.getElementById("modal_confirmar_carrito");
    modal.showModal(); // Abre el modal
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById("modal_confirmar_carrito");
    modal.close(); // Cierra el modal
}

// Event listener para el botón de cancelar
document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarModal);

// Event listener para el botón de confirmar
document.getElementById("btn-confirmar-carrito").addEventListener("click", () => {
    // Aquí podrías agregar la lógica para confirmar la venta.
    localStorage.clear()
    console.log("Venta confirmada");
    cargarCarrito();
    cerrarModal();
});

});


