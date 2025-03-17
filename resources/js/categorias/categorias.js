import { showToast } from "../toast";

document.addEventListener("DOMContentLoaded", function () {
    listarCategorias();
});

// FUNCIONES PARA LOS MODALS
let categoriaId = '';
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");

function openModal() {
    document.getElementById("id_modal_categoria").showModal();
    limpiarFormulario();
}

function closeModal() {
    document.getElementById("id_modal_categoria").close();
}

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);

// FUNCIONES PARA LA DATATABLE

let categorias = [];
let currentPage = 1;
let limit = parseInt(document.getElementById("limitSelect").value);

const renderTable = () => {
    const categoriaData = document.getElementById("categoriaData");
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const filteredCategorias = categorias.filter(
        (categoria) => categoria.nombre.toLowerCase().includes(searchValue)
    );

    const start = (currentPage - 1) * limit;
    const paginatedCategorias = filteredCategorias.slice(start, start + limit);

    categoriaData.innerHTML = paginatedCategorias
        .map(
            (categoria) => `
        <tr>
            <td>${categoria.id}</td>
            <td>${categoria.nombre}</td>
            <td>${categoria.created_at}</td>
            <td><button class="btn btn-info btn-abrir" data-categoria-id="${categoria.id}">Editar</button></td>
            <td><button class="btn btn-danger btn-eliminar" data-categoria-id-delete="${categoria.id}">Eliminar</button></td>
        </tr>
    `
        )
        .join("");

    document.querySelectorAll(".btn-abrir").forEach((btn) => {
        btn.addEventListener("click", function () {
            obtenerCategoria(btn.getAttribute("data-categoria-id"));
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", function () {
            mostrarModalEliminar(btn.getAttribute("data-categoria-id-delete"));
        });
    });

    renderPagination(filteredCategorias.length);
};

function renderPagination(totalCategorias) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalCategorias / limit);

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

document.getElementById("searchInput").addEventListener("input", function () {
    currentPage = 1;
    renderTable();
});

// OBTENER CATEGORÍAS
function listarCategorias() {
    fetch("/get-categorias")
        .then((response) => response.json())
        .then((data) => {
            categorias = data;
            renderTable();
        });
}

// OBTENER CATEGORÍA POR ID
function obtenerCategoria(id) {
    fetch(`/get-categorias/${id}`)
        .then((response) => response.json())
        .then((data) => {
            categoriaId = data.id;
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("modalTitle").textContent = "Editar Categoría";
            openModal();
        });
}

// GUARDAR CATEGORÍA
document.getElementById("submitFormCategoria").addEventListener("click", function () {
    const nombre = document.getElementById("nombre").value;
    if (!nombre.trim()) {
        document.getElementById("errorNombre").textContent = "El nombre es requerido.";
        return;
    }

    const categoriaData = { nombre };

    if (categoriaId) {
        // Editar categoría
        axios
            .put(`/put-categorias/${categoriaId}`, categoriaData)
            .then((response) => {
                showToast("Categoría actualizada con éxito", "success");
                listarCategorias();
                closeModal();
            })
            .catch((error) => {
                console.error("Error al actualizar la categoría:", error);
                showToast("No se pudo actualizar la categoría", "error");
            });
    } else {
        // Crear categoría
        axios
            .post(`/post-categorias`, categoriaData)
            .then((response) => {
                showToast("Categoría creada con éxito", "success");
                listarCategorias();
                closeModal();
            })
            .catch((error) => {
                console.error("Error al crear la categoría:", error);
                showToast("No se pudo crear la categoría", "error");
            });
    }
});


// ELIMINAR CATEGORÍA
function mostrarModalEliminar(id) {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
        fetch(`/delete-categorias/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => {
                listarCategorias();
            });
    }
}

