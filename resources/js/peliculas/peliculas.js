import { showToast } from "../toast";
import { limpiarFormulario } from "../usuarios/clean-form";
import { formatFecha } from "../usuarios/format-date";

document.addEventListener("DOMContentLoaded", function () {
    listarPeliculas();
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
    limpiarFormulario();
}

function closeModal() {
    id_modal_pelicula.close(); // Cierra el modal
}

btnOpenModal.addEventListener("click", (e) => {
    openModal();
});

btnCloseModal.addEventListener("click", (e) => {
    closeModal();
    limpiarFormulario();
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
            <td><img src="storage/${pelicula.foto}" alt="${pelicula.foto}" width="50"></td>
            <td>${pelicula.year}</td>
            <td>${pelicula.trailer_url}</td>
            <td><button  type="button" class="btn-abrir btn flex btn-active rounded-full w-10 btn-info text-sm text-white" data-pelicula-id="${pelicula.id}">Editar</button></td>
            <td><button class="btn btn-danger btn-eliminar-m" data-pelicula-id-delete="${pelicula.id}">Eliminar</button></td>
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
    console.log('id',id)
    id_modal_pelicula.showModal()
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
console.log(data)
            id_modal_pelicula.showModal();
        })
        .catch((error) =>
            console.error("Error al obtener las peliculas:", error)
        );
};

// REGISTRAR O ACTUALIZAR UNA PELICULA
document
    .getElementById("submitFormPeli")
    .addEventListener("click", function () {
        const peliculaId = document.getElementById("peliculaId").value;
        const titulo = document.getElementById("nombre").value;
        const director = document.getElementById("descripcion").value;
        const genero = document.getElementById("categoria").value;
        const fechaEstreno = document.getElementById("year").value;
        const poster = document.getElementById("foto").value;
        const trailer_url = document.getElementById("trailer_url").value;

        const data = {
            nombre: titulo,
            descripcion: director,
            categoria: genero,
            year: fechaEstreno,
            foto: poster, // Aquí podrías incluir la imagen de la película
            trailer_url: trailer_url
        };

        if (peliculaId) {
            data.id = peliculaId; // Incluir el ID de la película
            axios
                .put(`/put-peliculas/${peliculaId}`, data)
                .then((response) => {
                    showToast("Película actualizada con éxito", "success");
                    document.getElementById("id_modal_pelicula").close();
                    listarPeliculas();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    showToast("No se pudo actualizar la película", "error");
                });

            limpiarFormulario();
        } else {
            axios
                .post("/post-peliculas", data)
                .then((response) => {
                    showToast("Película creada con éxito", "success");
                    document.getElementById("id_modal_pelicula").close();
                    listarPeliculas();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    showToast("No se pudo registrar la película", "error");
                });

            limpiarFormulario();
        }
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
