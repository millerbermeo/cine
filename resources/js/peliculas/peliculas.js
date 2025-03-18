import { showToast } from "../toast";
import { limpiarFormularioPeliculas } from "../usuarios/clean-form";
import { formatFecha } from "../usuarios/format-date";
import { limpiarValidaciones, validarCampo } from "../validar-inputs";

document.addEventListener("DOMContentLoaded", function () {
    listarPeliculas();
    listarCategoriasSelect();
});

// FUNCIONES PARA LOS MODALS
let identificador = "";
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");

function mostrarModalEliminar(id) {
    const modalEliminar = document.getElementById("modal_eliminar_pelicula");
    identificador = id;
    modalEliminar.showModal();
}

function openModal() {
    id_modal_pelicula.showModal();
    limpiarFormularioPeliculas();
}

function closeModal() {
    limpiarValidaciones([
        { idInput: "nombre", idError: "nombreError" },
        { idInput: "descripcion", idError: "descripcionError" },
        { idInput: "categoria", idError: "CategoriaError", errorClass: "select-error" },
        { idInput: "year", idError: "YearError" }
    ]);
    id_modal_pelicula.close();
}

btnOpenModal.addEventListener("click", (e) => {
    openModal();
});

btnCloseModal.addEventListener("click", (e) => {
    closeModal();
    limpiarFormularioPeliculas();
});

// FUNCIONES PARA LA DATATABLE
let peliculas = [];
let currentPage = 1;
let limit = parseInt(document.getElementById("limitSelect").value);

const renderTable = () => {
    const peliculaData = document.getElementById("peliculaData");
    const searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const filteredPeliculas = peliculas.filter((pelicula) =>
        pelicula.nombre.toLowerCase().includes(searchValue)
    );

    const start = (currentPage - 1) * limit;
    const paginatedPeliculas = filteredPeliculas.slice(start, start + limit);

    peliculaData.innerHTML = paginatedPeliculas
        .map(
            (pelicula) => `
        <tr>
            <td>${pelicula.id}</td>
            <td>${pelicula.nombre}</td>
            <td>${pelicula.descripcion}</td>
            <td>${pelicula.categoria}</td>
            <td><img class="rounded-full h-12 w-12" src="storage/${pelicula.foto}" alt="${pelicula.foto}""></td>
            <td>${pelicula.year}</td>
            <td>${pelicula.trailer_url}</td>
            <td><button  type="button" class="btn-abrir btn flex btn-active rounded-4xl btn-info text-sm text-white" data-pelicula-id="${pelicula.id}">Editar</button></td>
            <td><button class="btn btn-error rounded-4xl text-white btn-eliminar-m" data-pelicula-id-delete="${pelicula.id}">Eliminar</button></td>
        </tr>
    `
        )
        .join("");

    // Delegar el evento al contenedor principal
    peliculaData.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-abrir")) {
            const id = e.target.getAttribute("data-pelicula-id");
            obtenerPelicula(id);
        }
    });

    peliculaData.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-eliminar-m")) {
            const id = e.target.getAttribute("data-pelicula-id-delete");
            mostrarModalEliminar(id);
        }
    });

    renderPagination(filteredPeliculas.length);
};

function renderPagination(totalPeliculas) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalPeliculas / limit);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("input");
        button.type = "radio";
        button.name = "pagination";
        button.className = "join-item btn btn-square";
        button.setAttribute("aria-label", i);
        button.value = i;

        if (i === currentPage) {
            button.checked = true;
        }

        button.addEventListener("change", function () {
            currentPage = parseInt(this.value);
            renderTable();
        });

        paginationContainer.appendChild(button);
    }
}

document.getElementById("searchInput").addEventListener("input", () => {
    currentPage = 1;
    renderTable();
});

document.getElementById("limitSelect").addEventListener("change", (e) => {
    limit = parseInt(e.target.value);
    currentPage = 1;
    renderTable();
});

// FUNCION QUE LISTA LAS PELICULAS
const listarPeliculas = () => {
    fetch("/get-peliculas")
        .then((response) => response.json())
        .then((data) => {
            peliculas = data;
            renderTable();
        })
        .catch((error) =>
            console.error("Error al obtener las peliculas:", error)
        );
};

// FUNCION QUE OBTIENE UNA PELICULA
const obtenerPelicula = (id) => {
    console.log("id", id);
    id_modal_pelicula.showModal();
    fetch(`/get-peliculas/${id}`)
        .then((response) => response.json())
        .then((data) => {
            // Aquí se asignan los valores a los campos del formulario
            document.getElementById("peliculaId").value = data.id;
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("descripcion").value = data.descripcion;
            document.getElementById("categoria").value = data.categoria;
            document.getElementById("year").value = data.year;
            document.getElementById("trailer_url").value = data.trailer_url;
            console.log(data);
            id_modal_pelicula.showModal();
        })
        .catch((error) =>
            console.error("Error al obtener las peliculas:", error)
        );
};



document.getElementById("submitFormPeli").addEventListener("click", function () {
    const peliculaId = document.getElementById("peliculaId").value;
    const trailer_url = document.getElementById("trailer_url").value;
    const fotoInput = document.getElementById("foto");

    // Validaciones
    const esNombreValido = validarCampo("nombre", "nombreError", "El nombre es requerido.");
    const esDescripcionValida = validarCampo("descripcion", "descripcionError", "La descripción es requerida.");
    const esCategoriaValida = validarCampo("categoria", "CategoriaError", "La categoría es requerida.", "select-error");
    const esFechaEstrenoValida = validarCampo("year", "YearError", "El año es requerido.");

    // Validación adicional para el año (solo 4 dígitos)
    const fechaEstreno = document.getElementById("year").value.trim();
    if (esFechaEstrenoValida && !/^\d{4}$/.test(fechaEstreno)) {
        document.getElementById("YearError").textContent = "El año ingresado no es válido.";
        return;
    }

    // Detener el proceso si hay errores
    if (!esNombreValido || !esDescripcionValida || !esCategoriaValida || !esFechaEstrenoValida) {
        return;
    }

    limpiarValidaciones([
        { idInput: "nombre", idError: "nombreError" },
        { idInput: "descripcion", idError: "descripcionError" },
        { idInput: "categoria", idError: "CategoriaError", errorClass: "select-error" },
        { idInput: "year", idError: "YearError" }
    ]);
    

    const peliculaData = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        categoria: document.getElementById("categoria").value.trim(),
        year: fechaEstreno,
        trailer_url: trailer_url.trim(),
    };

    const formData = new FormData();
    for (const key in peliculaData) {
        formData.append(key, peliculaData[key]);
    }

    if (fotoInput.files.length > 0) {
        formData.append("foto", fotoInput.files[0]); // Agregar la foto si se seleccionó
    }

    if (peliculaId) {
        // Actualizar película
        axios.put(`/put-peliculas/${peliculaId}`, peliculaData, {
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            showToast("Película actualizada con éxito", "success");
            document.getElementById("id_modal_pelicula").close();
            listarPeliculas();
        }).catch(() => {
            showToast("No se pudo actualizar la película", "error");
        });
    } else {
        // Crear nueva película
        axios.post("/post-peliculas", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(() => {
            showToast("Película creada con éxito", "success");
            document.getElementById("id_modal_pelicula").close();
            listarPeliculas();
        }).catch(() => {
            showToast("No se pudo registrar la película", "error");
        });
    }

    limpiarFormularioPeliculas();
});


// FUNCION PARA ELIMINAR UNA PELICULA
document
    .getElementById("btn-confirmar-eliminar")
    .addEventListener("click", function () {
        fetch(`/delete-peliculas/${identificador}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al eliminar la película");
                }
                return response.json();
            })
            .then((data) => {
                showToast(data.message, "success");
                listarPeliculas();
                document.getElementById("modal_eliminar_pelicula").close();
            })
            .catch((error) => console.error("Error:", error));
    });

//LISTAR CATEGORIA DE UN SLEECT

function listarCategoriasSelect() {
    fetch("/get-categorias")
        .then((response) => response.json())
        .then((data) => {
            const selectCategoria = document.getElementById("categoria");

            // Limpiar el select antes de agregar nuevas opciones
            selectCategoria.innerHTML =
                "<option disabled selected>Selecciona una categoría</option>";

            // Agregar nuevas opciones dinámicamente
            data.forEach((categoria) => {
                const option = document.createElement("option");
                option.value = categoria.nombre; // ID de la categoría (opcional)
                option.textContent = categoria.nombre; // Nombre de la categoría
                selectCategoria.appendChild(option);
            });
        })
        .catch((error) => console.error("Error al obtener categorías:", error));
}
