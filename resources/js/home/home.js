import { formatearNumero } from "../format-precio";
import { showToast } from "../toast";

document.addEventListener("DOMContentLoaded", async function () {
    listarCategoriasSelect()
    mostrarCantidadPeliculas();
    actualizarColoresTarjetas(); // Asegura que las tarjetas se actualicen al cargar la página


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
    const precioMinInput = document.getElementById("precioMin");
    const precioMaxInput = document.getElementById("precioMax");


    async function fetchPeliculas(page, fecha1 = "", fecha2 = "", precioMin = "", precioMax = "") {
        try {
            loader.classList.remove("hidden");

            let url = `/get-peliculas?page=${page}`;
            if (fecha1 && fecha2) {
                url += `&fecha1=${fecha1}&fecha2=${fecha2}`;
            }

            // Agregar los parámetros de precio solo si se han definido
            if (precioMin && precioMax) {
                url += `&precio_min=${precioMin}&precio_max=${precioMax}`;
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
        const precioMin = precioMinInput.value; // Obtener el valor de precio mínimo
        const precioMax = precioMaxInput.value; // Obtener el valor de precio máximo

        // Agregar console.log para verificar los valores de los filtros
        console.log("Precio Mínimo:", precioMin);
        console.log("Precio Máximo:", precioMax);

        // Llamar a fetchPeliculas con los filtros aplicados
        fetchPeliculas(currentPage, fecha1Input.value, fecha2Input.value, precioMin, precioMax);
    }


    precioMinInput.addEventListener("change", applyFilters);
    precioMaxInput.addEventListener("change", applyFilters);


    fecha1Input.addEventListener("change", applyFilters);
    fecha2Input.addEventListener("change", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);

    // Filtrar por búsqueda en tiempo real
    function filtrarPeliculas(peliculas, searchTerm, category) {
        const searchWords = searchTerm ? searchTerm.split(/\s+/) : [];

        return peliculas.filter((pelicula) => {
            const nombre = pelicula.nombre?.toLowerCase() || "";
            const categoria = pelicula.categoria?.toLowerCase() || "";
            const descripcion = pelicula.descripcion?.toLowerCase() || "";

            // Convierte el término de búsqueda en un array de palabras
            const searchWords = searchTerm.toLowerCase().split(' ').filter(Boolean);

            // Verifica que todas las palabras de búsqueda estén presentes en el nombre o descripción
            const matchesSearchTerm = searchWords.every(word =>
                nombre.includes(word) || descripcion.includes(word)
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
        actualizarColoresTarjetas()
        peliculasContainer.innerHTML = filteredPeliculas
            .map(
                (pelicula) => `
            <div class="card card-side border-gray-300 border bg-base-100 shadow max-h-[130px] duration-500 transition-all">
                <figure>
                    <img class="${pelicula.foto ? "" : "hidden"
                    } w-[80px] bg-white object-fill h-full" src="storage/${pelicula.foto
                    }" />
                </figure>
                <div class="card-body p-2">
                 <div class="flex gap-3 relative justify-between items-center w-full"><h2 class="card-title uppercase">${pelicula.nombre}</h2></div>
                    
                  <div class="flex gap-2 justify-between w-full">
                            <p class="text-gray-400 text-xs">${pelicula.descripcion.split(" ")[0]}</p>
                    <p class="text-gray-400 uppercase font-bold text-xs">${formatearNumero(pelicula.precio)}</p>
                       </div>

             
                       <div class="flex gap-2 justify-between w-full">
                        <p class="text-gray-400 uppercase font-bold text-xs">${pelicula.categoria}</p>
                        <p class="text-success font-bold text-xs">${pelicula.year}</p>
                       </div>
                    <div class="card-actions justify-between">
                    <button class="btnCar text-sm btn-info btn rounded-full w-8 h-8 text-white" data-pelicula='${JSON.stringify(pelicula)}'>+</button>
                        <button class="text-lg underline text-success btntrailer" data-trailer-url="${pelicula.trailer_url
                    }">Ver más</button>
                    </div>
                </div>
            </div>
        `
            )
            .join("");
            actualizarColoresTarjetas(); // Llamar después de actualizar el carrito

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
            const pelicula = JSON.parse(peliculaData);
    
            let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
    
            // Buscar si la película ya está en el carrito
            const peliculaExistente = peliculasEnCarrito.find(p => p.id === pelicula.id);
    
            if (peliculaExistente) {
                peliculaExistente.cantidad += 1;
            } else {
                pelicula.cantidad = 1;
                peliculasEnCarrito.push(pelicula);
            }
    
            // Guardar en localStorage
            localStorage.setItem("peliculasCarrito", JSON.stringify(peliculasEnCarrito));
    
            // Recargar el carrito en la UI
            cargarCarrito();
    
            // Actualizar el color de la tarjeta
            actualizarColoresTarjetas();
    
            showToast("Película añadida al carrito", "success");
        }
    });
    
function actualizarColoresTarjetas() {
    let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];

    document.querySelectorAll(".card").forEach(card => {
        const btn = card.querySelector(".btnCar");
        if (!btn) return;

        try {
            const peliculaData = JSON.parse(btn.getAttribute("data-pelicula"));
            const enCarrito = peliculasEnCarrito.some(p => p.id === peliculaData.id);

            if (enCarrito) {
                card.classList.add("bg-green-200"); // Mantiene el color si está en el carrito
            } else {
                card.classList.remove("bg-green-200"); // Lo quita si ya no está en el carrito
            }
        } catch (error) {
            console.error("Error al procesar la tarjeta:", error);
        }
    });
}
    

    

    document.getElementById("BtnExcell").addEventListener("click", async function () {
        const searchInput = document.getElementById("searchInput");
        const fecha1Input = document.getElementById("fecha1");
        const fecha2Input = document.getElementById("fecha2");
        const categoryFilter = document.getElementById("categoryFilter");

        const searchTerm = searchInput.value.trim().toLowerCase();
        const fecha1 = fecha1Input.value;
        const fecha2 = fecha2Input.value;
        const categoria = categoryFilter.value;

        let page = 1;
        let peliculas = [];
        let totalPeliculas = 0;
        let totalPages = 1;

        const loadingContainer = document.getElementById("descargando"); // Contenedor de carga

        try {
            let url = `/get-peliculas?export=true&page=${page}`;

            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            if (fecha1 && fecha2) {
                url += `&fecha1=${fecha1}&fecha2=${fecha2}`;
            }
            if (categoria) {
                url += `&categoria=${categoria}`;
            }

            // Mostrar contenedor de carga
            loadingContainer.classList.remove("hidden");

            while (page <= totalPages) {
                const response = await fetch(url);
                const data = await response.json();

                if (data.data) {
                    peliculas = peliculas.concat(data.data);
                    totalPages = data.last_page;
                    page++;
                    url = `/get-peliculas?export=true&page=${page}&categoria=${categoria}`;
                } else {
                    showToast("No hay más datos para exportar.");
                    break;
                }
            }

            if (!peliculas || peliculas.length === 0) {
                showToast("No hay datos para exportar.");
                return;
            }

            let archivo; // Variable para almacenar el archivo único

            // Crear el archivo Excel con todas las películas
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Películas");

            worksheet.addRow(["Nombre", "Categoría", "Descripción", "Año"]);

            peliculas.forEach((pelicula) => {
                worksheet.addRow([pelicula.nombre, pelicula.categoria, pelicula.descripcion, pelicula.year]);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            archivo = {
                blob,
                nombre: "Peliculas_Completo.xlsx",
            };

            // Descargar el archivo generado
            const a = document.createElement("a");
            a.href = URL.createObjectURL(archivo.blob);
            a.download = archivo.nombre;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Ocultar el contenedor de carga cuando termine la descarga
            loadingContainer.classList.add("hidden");

        } catch (error) {
            console.error("Error al exportar las películas:", error);
            showToast("Hubo un error al exportar las películas.");
            loadingContainer.classList.add("hidden"); // Ocultar contenedor de carga en caso de error
        }
    });



    function cargarCarrito() {
        const peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
        const cartList = document.getElementById("cartList");
        mostrarCantidadPeliculas();
        cartList.innerHTML = "";
    
        if (peliculasEnCarrito.length === 0) {
            cartList.innerHTML = "<li><p>No hay películas en el carrito</p></li>";
        } else {
            let totalCarrito = 0;
    
            peliculasEnCarrito.forEach(pelicula => {
                const li = document.createElement("div");
                li.classList.add("card", "card-side", "border-gray-300", "border-b-[1px]", "bg-white", "mb-2", "p-1", "rounded-none");
                li.setAttribute("id", `item-${pelicula.id}`);
                li.innerHTML = `
                    <figure><img class="w-[40px] h-[40px] object-cover rounded-full" src="storage/${pelicula.foto}" alt="${pelicula.nombre}" /></figure>
                    <div class="card-body p-2">
                        <h2 class="card-title text-xs uppercase">${pelicula.nombre}</h2>
                        <p class="text-black font-normal text-xs">${formatearNumero(pelicula.precio)} X <span id="cantidad-${pelicula.id}">${pelicula.cantidad}</span></p>
                        <div class="flex gap-2 justify-between w-full">
                            <p class="text-gray-400 uppercase font-italic text-xs">${pelicula.categoria}</p>
                            <p class="text-success font-bold text-xs">${pelicula.year}</p>
                            <div class="">
                                <button class="btn btnMenos" data-id="${pelicula.id}"> - </button>
                                <button class="btn btnMas" data-id="${pelicula.id}"> + </button>
                            </div>
                        </div>
                        <div class="card-actions justify-between">
                            <button class="absolute rounded-full -top-1 text-white w-5 cursor-pointer h-5 bg-error right-2 btn-lg btn-danger btn-outline eliminar-btn" data-id="${pelicula.id}">X</button>
                        </div>
                    </div>
                `;
                cartList.appendChild(li);
                totalCarrito += pelicula.precio * pelicula.cantidad;
            });
    
            // Mostrar total del carrito
            const totalElement = document.createElement("div");
            totalElement.classList.add("text-right", "font-normal", "text-xl", "mt-4");
            totalElement.setAttribute("id", "totalCarrito");
            totalElement.innerHTML = `Total: ${formatearNumero(String(totalCarrito), true)}`;
            cartList.appendChild(totalElement);
    
            // Botón de confirmar venta
            const btnAbrirModal = document.createElement("button");
            btnAbrirModal.classList.add("btn", "btn-success", "mt-4");
            btnAbrirModal.innerHTML = "Confirmar Venta";
            cartList.appendChild(btnAbrirModal);
            btnAbrirModal.addEventListener("click", abrirModal);
    
            // Agregar eventos a los botones de aumentar y disminuir cantidad
            document.querySelectorAll(".btnMas").forEach(btn => {
                btn.addEventListener("click", function () {
                    actualizarCantidad(this.getAttribute("data-id"), 1);
                });
            });
    
            document.querySelectorAll(".btnMenos").forEach(btn => {
                btn.addEventListener("click", function () {
                    actualizarCantidad(this.getAttribute("data-id"), -1);
                });
            });
    
            // Eliminar película del carrito
            document.querySelectorAll(".eliminar-btn").forEach(btn => {
                btn.addEventListener("click", function () {
                    eliminarDelCarrito(this.getAttribute("data-id"));
                });
            });
        }
    }
    
    // Función para actualizar la cantidad en el carrito
    function actualizarCantidad(id, cambio) {
        let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
    
        // Buscar la película en el carrito
        const pelicula = peliculasEnCarrito.find(p => p.id == id);
        
        if (pelicula) {
            // Modificar la cantidad
            pelicula.cantidad = Math.max(1, pelicula.cantidad + cambio);
    
            // Actualizar cantidad en el DOM sin recargar todo
            document.getElementById(`cantidad-${id}`).textContent = pelicula.cantidad;
        }
    
        // Guardar cambios en localStorage
        localStorage.setItem("peliculasCarrito", JSON.stringify(peliculasEnCarrito));
    
        // Actualizar total del carrito sin recargar
        actualizarTotal();
    }
    
    // Función para actualizar el total del carrito
    function actualizarTotal() {
        let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
        let total = peliculasEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        
        document.getElementById("totalCarrito").textContent = `Total: ${formatearNumero(String(total), true)}`;
    }
    
    // Función para eliminar una película del carrito
    function eliminarDelCarrito(id) {
        let peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
        peliculasEnCarrito = peliculasEnCarrito.filter(pelicula => pelicula.id != id);
        localStorage.setItem("peliculasCarrito", JSON.stringify(peliculasEnCarrito));
        actualizarColoresTarjetas(); // 🔴 Actualiza los colores después de eliminar
        mostrarCantidadPeliculas()
        // Remover del DOM
        const item = document.getElementById(`item-${id}`);
        if (item) {
            item.remove();
        }
    
        // Actualizar total
        actualizarTotal();
    }
    
    // Función para abrir el modal
    function abrirModal() {
        const modal = document.getElementById("modal_confirmar_carrito");
        modal.classList.remove("hidden");  // Muestra el modal al quitar la clase hidden
        modal.classList.add("flex");       // Añade la clase flex para que sea visible
        cargarDatosPrevios()
    }
    
    // Función para cerrar el div
    function cerrarModal() {
        const modal = document.getElementById("modal_confirmar_carrito");
        modal.classList.remove("flex");    // Quita la clase flex
        modal.classList.add("hidden");     // Vuelve a ocultar el modal con la clase hidden
    }
    
    // Event listeners para cerrar el modal
    document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarModal);
    document.getElementById("btn-confirmar-carrito").addEventListener("click", () => {
        localStorage.clear();
        console.log("Venta confirmada");
        actualizarColoresTarjetas(); // 🔴 Asegura que se deseleccionen todas las tarjetas

        cargarCarrito();
        cerrarModal();
    });
    
    // Cargar el carrito al iniciar
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



    $('#cliente_select').select2({
        placeholder: 'Buscar por nombre o identificación',
        ajax: {
            url: '/get-clientes',  // Ruta para obtener todos los clientes
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    search: params.term  // El término de búsqueda
                };
            },
            processResults: function (data) {
                return {
                    results: data.map(cliente => ({
                        id: cliente.id,
                        text: cliente.nombre + ' (' + cliente.numero_documento + ')'
                    }))
                };
            },
            cache: true
        }
    });

    function mostrarFormulario(tipo) {
        if (tipo === 'buscar') {
            document.getElementById("form_cliente").classList.remove("hidden");
            document.getElementById("crear_cliente").classList.add("hidden");
        } else {
            document.getElementById("form_cliente").classList.add("hidden");
            document.getElementById("crear_cliente").classList.remove("hidden");
        }
    }
    
    // Evento al seleccionar un cliente del select2
    $('#cliente_select').on('select2:select', function (e) {
        const clienteId = e.params.data.id;
        obtenerCliente(clienteId);
    });
    
    // Obtener los datos del cliente
    function obtenerCliente(clienteId) {
        $.get(`/get-clientes/${clienteId}`, function (data) {
            if (data) {
                // Si el cliente existe, mostrar el formulario de cliente
                $("#form_cliente").removeClass("hidden");
                $("#crear_cliente").addClass("hidden");
    
                // Rellenar los campos del formulario con los datos del cliente
                $("#nombre").val(data.nombre);
                $("#tipo_documento").val(data.tipo_documento);
                $("#numero_documento").val(data.numero_documento);
                $("#email").val(data.email);
                $("#telefono").val(data.telefono);
            } else {
                // Si no existe, mostrar formulario para crear un nuevo cliente
                $("#form_cliente").addClass("hidden");
                $("#crear_cliente").removeClass("hidden");
            }
        });
    }
    
    // Enviar los datos para crear un nuevo cliente
    $("#nuevoClienteForm").on("submit", function (e) {
        e.preventDefault();
        const token = $('meta[name="csrf-token"]').attr('content');
    
        const nuevoCliente = {
            nombre: $("#nombre_nuevo").val(),
            tipo_documento: $("#tipo_documento_nuevo").val(),
            numero_documento: $("#numero_documento_nuevo").val(),
            email: $("#email_nuevo").val(),
            telefono: $("#telefono_nuevo").val()
        };
    
        $.ajax({
            url: '/post-clientes',
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token  // Agregar token CSRF en los encabezados correctamente
            },
            data: nuevoCliente,
            success: function (data) {
                alert('Cliente creado exitosamente');
                obtenerCliente(data.id);
            },
            error: function () {
                alert('Error al crear el cliente');
            }
        });
    });

    $("#btn-buscar-cliente").on("click", function() {
        mostrarFormulario('buscar');
    });
    $("#btn-registrar-cliente").on("click", function() {
        mostrarFormulario('registrar');
    });
    
    // Cerrar el modal
    $("#btn-cerrar-carrito").on("click", function () {
        const modal = document.getElementById("modal_confirmar_carrito");
        modal.classList.add('hidden');
    });

    function mostrarFormulario(tipo) {
        if (tipo === 'buscar') {
            $("#form_cliente").removeClass("hidden");
            $("#crear_cliente").addClass("hidden");
            $("#btn-buscar-cliente").addClass("hidden");
            $("#btn-registrar-cliente").removeClass("hidden");
        } else {
            $("#form_cliente").addClass("hidden");
            $("#crear_cliente").removeClass("hidden");
            $("#btn-buscar-cliente").removeClass("hidden");
            $("#btn-registrar-cliente").addClass("hidden");
        }
    }


    function cargarDatosPrevios() {
        // Ejemplo: obtener datos desde localStorage
        const datosPrevios = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
    
        const contenedorDatos = document.getElementById("DatosPrevios");
        contenedorDatos.innerHTML = ""; // Limpiar contenido previo
    
        if (datosPrevios.length === 0) {
            contenedorDatos.innerHTML = "<p>No hay datos previos.</p>";
        } else {
            // Crear tabla con clases de DaisyUI y Tailwind CSS
            const tabla = document.createElement("table");
            tabla.classList.add("table", "table-zebra", "w-full", "mt-4");
    
            // Crear encabezado de la tabla
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
            `;
    
            // Rellenar la tabla con los datos de cada película
            datosPrevios.forEach(dato => {
                tabla.innerHTML += `
                    <tr>
                        <td>${dato.id}</td>
                        <td>${dato.nombre}</td>
                        <td>${dato.descripcion}</td>
                        <td>${formatearNumero(dato.precio)}</td>
                        <td>${dato.cantidad}</td>
                    </tr>
                `;
            });
    
            // Cerrar el cuerpo de la tabla
            tabla.innerHTML += "</tbody>";
    
            // Agregar la tabla al contenedor de datos
            contenedorDatos.appendChild(tabla);
        }
    }


    function mostrarCantidadPeliculas() {
        // Obtener las películas del carrito desde localStorage
        const peliculasEnCarrito = JSON.parse(localStorage.getItem("peliculasCarrito")) || [];
        
        // Contar el número de películas únicas en el carrito
        const cantidadPeliculasUnicas = new Set(peliculasEnCarrito.map(pelicula => pelicula.id)).size;
        
        // Mostrar la cantidad en el elemento con id "CantidadItems"
        if (cantidadPeliculasUnicas > 0) {
            $("#CantidadItems").text(cantidadPeliculasUnicas).show();
        } else {
            $("#CantidadItems").hide(); // Ocultar el badge si no hay películas
        }
    }


 
    
    
    
    
});



