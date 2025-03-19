import { showToast } from "../toast";
import { formatFecha } from "../usuarios/format-date";

document.addEventListener("DOMContentLoaded", function () {
    listarCategorias();
});

// FUNCIONES PARA LOS MODALS
let categoriaId = "";
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");

function openModal() {
    document.getElementById("id_modal_categoria").showModal();
    limpiarFormulario();
}

function closeModal() {
    document.getElementById("id_modal_categoria").close();
    document.getElementById("nombre").value = "";
    const nombreInput = document.getElementById("nombre");
    document.getElementById("errorNombre").textContent = "";
    nombreInput.classList.remove("input-error");
}

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);

// FUNCIONES PARA LA DATATABLE

let categorias = [];
let currentPage = 1;
let limit = parseInt(document.getElementById("limitSelect").value);

const renderTable = () => {
    const categoriaData = document.getElementById("categoriaData");
    const searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase();
    const filteredCategorias = categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(searchValue) ||
        categoria.estado.toLowerCase().includes(searchValue)
    );

    const start = (currentPage - 1) * limit;
    const paginatedCategorias = filteredCategorias.slice(start, start + limit);

    categoriaData.innerHTML = paginatedCategorias
        .map(
            (categoria) => `
        <tr>
            <td>${categoria.id}</td>
            <td>${categoria.nombre}</td>
            <td>${formatFecha(categoria.created_at)}</td>
               <td>
                <label class="swap flex gap-2">
                                    ${
                                        categoria.estado == 1
                                            ? "Activo"
                                            : "Inactivo"
                                    }
                    <input type="checkbox" class="toggle toggle-success" data-categoria-id="${
                        categoria.id
                    }" ${categoria.estado ? "checked" : ""}>
                </label>
                
            </td>
            <td><button class="btn btn-info rounded-4xl text-white btn-abrir" data-categoria-id="${
                categoria.id
            }">Editar</button></td>
            <td class="hidden"><button class="btn rounded-4xl btn-error text-white btn-eliminar" data-categoria-id-delete="${
                categoria.id
            }">Eliminar</button></td>
         
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

    document.querySelectorAll(".toggle").forEach((toggle) => {
        toggle.addEventListener("change", function () {
            const categoriaId = this.getAttribute("data-categoria-id");
            const estado = this.checked ? 'activo' : 'inactivo';
            actualizarEstadoCategoria(categoriaId, estado);
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
            document.getElementById("modalTitle").textContent =
                "Editar Categoría";
            openModal();
        });
}

// GUARDAR CATEGORÍA
document
    .getElementById("submitFormCategoria")
    .addEventListener("click", function () {
        const nombreInput = document.getElementById("nombre");
        let nombre = nombreInput.value.trim();
        
        nombre = nombre.toLowerCase().replace(/\s+/g, '');
        
        // Validación de campo vacío
        if (!nombre) {
            document.getElementById("errorNombre").textContent = "El nombre es requerido.";
            nombreInput.classList.add("input-error");
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
                    document.getElementById("nombre").value = "";
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error al actualizar la categoría:", error);
                    nombreInput.classList.add("input-error");
                    document.getElementById("ErrorCategoriaDuplicada").textContent = "La Categoria ya existe";
                });
        } else {
            // Crear categoría
            axios
                .post(`/post-categorias`, categoriaData)
                .then((response) => {
                    showToast("Categoría creada con éxito", "success");
                    listarCategorias();
                    document.getElementById("nombre").value = "";
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error al crear la categoría:", error);
                    nombreInput.classList.add("input-error");
                    document.getElementById("ErrorCategoriaDuplicada").textContent = "La Categoria ya existe";
                });
        }
    });

function mostrarModalEliminar(id) {
    categoriaId = id;
    document.getElementById("modal_eliminar_categoria").showModal();
}

// Evento para confirmar la eliminación
document
    .getElementById("btn-confirmar-eliminar")
    .addEventListener("click", function () {
        fetch(`/delete-categorias/${categoriaId}`, {
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
                    throw new Error("Error al eliminar la categoría");
                }
                return response.json();
            })
            .then(() => {
                showToast("Categoría eliminada con éxito", "success");
                listarCategorias();
                document.getElementById("modal_eliminar_categoria").close();
            })
            .catch((error) => console.error("Error:", error));
    });

document
    .getElementById("btn-cerrar-modal-eliminar")
    .addEventListener("click", function () {
        document.getElementById("modal_eliminar_categoria").close();
    });

function actualizarEstadoCategoria(categoriaId, estado) {
    // Hacer la petición al backend para actualizar el estado
    fetch(`/categoria/${categoriaId}/estado`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"),
        },
        body: JSON.stringify({ estado: estado }),
    })
        .then((response) => response.json())
        .then((data) => {
            showToast(
                `Categoría ${
                    estado ? "activada" : "desactivada"
                } con éxito`,
                "success"
            );
            listarCategorias()
        })
        .catch((error) => {
            console.error("Error:", error);
            showToast("Error al actualizar el estado de la categoría", "error");
        });
}
