import { showToast } from "../toast";
import { formatFecha } from "../usuarios/format-date";

$(document).ready(function () {
    listarCategorias();
});

function limpiarFormulario(idFormulario) {
    // Seleccionamos el formulario por su ID
    const formulario = $("#" + idFormulario);

    // Limpiar todos los campos de entrada del formulario
    formulario.find("input, textarea, select").val("");

    // Limpiar errores
    formulario.find(".error").text("");

    // Eliminar clases de error de los campos
    formulario.find(".input-error").removeClass("input-error");
}

// FUNCIONES PARA LOS MODALS
let categoriaId = "";
const $btnOpenModal = $("#btn-open-modal");
const $btnCloseModal = $("#btn-close-modal");

function openModal() {
    const modal = document.getElementById("id_modal_categoria");
    $("#errorNombre").text("");
    modal.showModal();
}

function closeModal() {
    const modal = document.getElementById("id_modal_categoria");
    modal.close();

    limpiarFormulario("id_modal_categoria");

}

$btnOpenModal.on("click", openModal);
$btnCloseModal.on("click", closeModal);

// FUNCIONES PARA LA DATATABLE
let categorias = [];
let currentPage = 1;
let limit = parseInt($("#limitSelect").val());

const renderTable = () => {
    const categoriaData = $("#categoriaData");
    const searchValue = $("#searchInput").val().toLowerCase();
    const filteredCategorias = categorias.filter((categoria) => {
        const searchWords = searchValue.split(' ').filter(Boolean); // Convierte el término de búsqueda en un array de palabras

        // Verifica que todas las palabras de búsqueda estén presentes en el nombre o estado de la categoría
        const matchesSearchTerm = searchWords.every(word =>
            categoria.nombre.toLowerCase().includes(word)
        );

        return matchesSearchTerm;
    });

    const start = (currentPage - 1) * limit;
    const paginatedCategorias = filteredCategorias.slice(start, start + limit);

    categoriaData.html(
        paginatedCategorias
            .map(
                (categoria) => `
            <tr>
                <td>${categoria.id}</td>
                <td>${categoria.nombre}</td>
                <td>${formatFecha(categoria.created_at)}</td>
                <td>
                    <label class="swap flex gap-2">
                        ${categoria.estado == 1 ? "Activo" : "Inactivo"}
                        <input type="checkbox" class="toggle toggle-success" data-categoria-id="${categoria.id}" ${categoria.estado ? "checked" : ""}>
                    </label>
                </td>
                <td><button class="btn btn-info rounded-4xl text-white btn-abrir" data-categoria-id="${categoria.id}">Editar</button></td>
                <td class="hidden"><button class="btn rounded-4xl btn-error text-white btn-eliminar" data-categoria-id-delete="${categoria.id}">Eliminar</button></td>
            </tr>
        `
            )
            .join("")
    );

    $(".btn-abrir").on("click", function () {
        obtenerCategoria($(this).data("categoria-id"));
    });

    $(".btn-eliminar").on("click", function () {
        mostrarModalEliminar($(this).data("categoria-id-delete"));
    });

    $(".toggle").on("change", function () {
        const categoriaId = $(this).data("categoria-id");
        const estado = this.checked ? 'activo' : 'inactivo';
        actualizarEstadoCategoria(categoriaId, estado);
    });

    renderPagination(filteredCategorias.length);
};

function renderPagination(totalCategorias) {
    const paginationContainer = $("#pagination");
    paginationContainer.empty();

    const totalPages = Math.ceil(totalCategorias / limit);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const $button = $(`<input type="radio" name="pagination" class="join-item btn btn-square" aria-label="${i}" value="${i}">`);

        if (i === currentPage) {
            $button.prop("checked", true);
        }

        $button.on("change", function () {
            currentPage = parseInt($(this).val());
            renderTable();
        });

        paginationContainer.append($button);
    }
}

$("#searchInput").on("input", function () {
    currentPage = 1;
    renderTable();
});

// OBTENER CATEGORÍAS
function listarCategorias() {
    $.get("/get-categorias", function (data) {
        categorias = data;
        renderTable();
    });
}

// OBTENER CATEGORÍA POR ID
function obtenerCategoria(id) {
    $.get(`/get-categorias/${id}`, function (data) {
        categoriaId = data.id;
        $("#nombre").val(data.nombre);
        $("#modalTitle").text("Editar Categoría");
        openModal();
    });
}

// GUARDAR CATEGORÍA
$("#submitFormCategoria").on("click", function () {
    const nombreInput = $("#nombre");
    let nombre = nombreInput.val().trim().toLowerCase();

    // Validacion
    if (!nombre) {
        $("#errorNombre").text("El nombre es requerido.");
        nombreInput.addClass("input-error");
        return;
    }

    const categoriaData = { nombre };

    if (categoriaId) {
        // Editar categoría
        axios
            .put(`/put-categorias/${categoriaId}`, categoriaData)
            .then(() => {
                showToast("Categoría actualizada con éxito", "success");
                listarCategorias();
                $("#nombre").val("");
                closeModal();
            })
            .catch((error) => {
                console.error("Error al actualizar la categoría:", error);
                nombreInput.addClass("input-error");
                $("#ErrorCategoriaDuplicada").text("La Categoria ya existe");
            });
    } else {
        // Crear categoría
        axios
            .post(`/post-categorias`, categoriaData)
            .then(() => {
                showToast("Categoría creada con éxito", "success");
                listarCategorias();
                $("#nombre").val("");
                closeModal();
            })
            .catch((error) => {
                console.error("Error al crear la categoría:", error);
                nombreInput.addClass("input-error");
                $("#ErrorCategoriaDuplicada").text("La Categoria ya existe");
            });
    }
});

function mostrarModalEliminar(id) {
    categoriaId = id;
    $("#modal_eliminar_categoria").showModal();
}

// Evento para confirmar la eliminación
$("#btn-confirmar-eliminar").on("click", function () {
    $.ajax({
        url: `/delete-categorias/${categoriaId}`,
        type: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function () {
            showToast("Categoría eliminada con éxito", "success");
            listarCategorias();
            $("#modal_eliminar_categoria").close();
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
});

$("#btn-cerrar-modal-eliminar").on("click", function () {
    $("#modal_eliminar_categoria").close();
});

function actualizarEstadoCategoria(categoriaId, estado) {
    $.ajax({
        url: `/categoria/${categoriaId}/estado`,
        type: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        data: JSON.stringify({ estado: estado }),
        success: function () {
            showToast(`Categoría ${estado ? "activada" : "desactivada"} con éxito`, "success");
            listarCategorias();
        },
        error: function () {
            showToast("Error al actualizar el estado de la categoría", "error");
        }
    });
}
