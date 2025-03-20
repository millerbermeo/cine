import { showToast } from "../toast";
import { formatFecha } from "../usuarios/format-date";

$(document).ready(function () {
    listarClientes();
});


let clienteId = "";
const $btnOpenModal = $("#btn-open-modal");
const $btnCloseModal = $("#btn-close-modal");

function openModal() {
    const modal = document.getElementById("id_modal_cliente");
    $("#errorNombre, #errorTipoDocumento, #errorNumeroDocumento, #errorEmail, #errorTelefono").text("");
    modal.showModal();
}

function closeModal() {
    const modal = document.getElementById("id_modal_cliente");
    modal.close();
    limpiarFormulario("id_modal_cliente");
}

$btnOpenModal.on("click", openModal);
$btnCloseModal.on("click", closeModal);

// Limpiar el formulario
function limpiarFormulario(idFormulario) {
    const formulario = $("#" + idFormulario);
    formulario.find("input, textarea, select").val("");
    formulario.find(".error").text("");
    formulario.find(".input-error").removeClass("input-error");
}

let clientes = [];
let currentPage = 1;
let limit = parseInt($("#limitSelect").val());

const renderTable = () => {
    const clienteData = $("#clienteData");
    const searchValue = $("#searchInput").val().toLowerCase();
    const filteredClientes = clientes.filter((cliente) => {
        const searchWords = searchValue.split(' ').filter(Boolean);
        return searchWords.every(word =>
            Object.values(cliente).some(value => 
                typeof value === "string" && value.toLowerCase().includes(word)
            )
        );
    });
    

    const start = (currentPage - 1) * limit;
    const paginatedClientes = filteredClientes.slice(start, start + limit);

    clienteData.html(
        paginatedClientes
            .map(
                (cliente) => `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.tipo_documento ?? ''}</td>
                <td>${cliente.numero_documento ?? ''}</td>
                <td>${cliente.email ?? ''}</td>
                <td>${cliente.telefono ?? ''}</td>
                <td>${formatFecha(cliente.created_at)}</td>
                <td>
                    <label class="swap flex gap-2">
                        ${cliente.estado == 'activo' ? "Activo" : "Inactivo"}
                        <input type="checkbox" class="toggle toggle-success" data-cliente-id="${cliente.id}" ${cliente.estado == 'activo' ? "checked" : ""}>
                    </label>
                </td>
                <td><button class="btn btn-info rounded-4xl text-white btn-abrir" data-cliente-id="${cliente.id}">Editar</button></td>
                <td class="hidden"><button class="btn rounded-4xl btn-error text-white btn-eliminar" data-cliente-id-delete="${cliente.id}">Eliminar</button></td>
            </tr>
        `
            )
            .join("")
    );

    $(".btn-abrir").on("click", function () {
        obtenerCliente($(this).data("cliente-id"));
    });

    $(".btn-eliminar").on("click", function () {
        mostrarModalEliminar($(this).data("cliente-id-delete"));
    });

    $(".toggle").on("change", function () {
        const clienteId = $(this).data("cliente-id");
        const estado = this.checked ? 'activo' : 'inactivo';
        actualizarEstadoCliente(clienteId, estado);
    });

    renderPagination(filteredClientes.length);
};

function renderPagination(totalClientes) {
    const paginationContainer = $("#pagination");
    paginationContainer.empty();
    const totalPages = Math.ceil(totalClientes / limit);

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

// Obtener Clientes
function listarClientes() {
    $.get("/get-clientes", function (data) {
        clientes = data;
        renderTable();
    });
}

// Obtener Cliente por ID
function obtenerCliente(id) {
    $.get(`/get-clientes/${id}`, function (data) {
        clienteId = data.id;
        $("#nombre").val(data.nombre);
        $("#tipo_documento").val(data.tipo_documento);
        $("#numero_documento").val(data.numero_documento);
        $("#email").val(data.email);
        $("#telefono").val(data.telefono);
        openModal();
    });
}

// Actualizar Estado Cliente
function actualizarEstadoCliente(clienteId, estado) {

    const token = $('meta[name="csrf-token"]').attr('content');

    $.ajax({
        type: "PATCH",
        url: `/put-clientes/${clienteId}/estado`,
        data: { estado },
        headers: {
            'X-CSRF-TOKEN': token  // Agregar token CSRF en los encabezados
        },
        success: function () {
            listarClientes();
        },
        error: function (error) {
            console.error(error);
        },
    });
}

// Eliminar Cliente
function mostrarModalEliminar(clienteId) {
    const modal = document.getElementById("modal_eliminar_cliente");
    modal.showModal();

    $("#btn-confirmar-eliminar").on("click", function () {
        eliminarCliente(clienteId);
    });

    $("#btn-cerrar-modal-eliminar").on("click", function () {
        modal.close();
    });
}

function eliminarCliente(clienteId) {
    $.ajax({
        type: "DELETE",
        url: `/clientes/${clienteId}`,
        success: function () {
            listarClientes();
            const modal = document.getElementById("modal_eliminar_cliente");
            modal.close();
        },
        error: function (error) {
            console.error(error);
        },
    });
}

$("#submitFormCliente").on("click", function () {
    const clienteData = {
        nombre: $("#nombre").val(),
        tipo_documento: $("#tipo_documento").val(),
        numero_documento: $("#numero_documento").val(),
        email: $("#email").val(),
        telefono: $("#telefono").val(),
    };

    // Limpiar mensajes de error
    $("#errorNombre, #errorTipoDocumento, #errorNumeroDocumento, #errorEmail, #errorTelefono").text("");

    let isValid = true;

    // Validar el nombre
    if (!clienteData.nombre.trim()) {
        $("#errorNombre").text("El nombre es obligatorio.");
        isValid = false;
    }

    // Validar tipo de documento
    if (!clienteData.tipo_documento) {
        $("#errorTipoDocumento").text("El tipo de documento es obligatorio.");
        isValid = false;
    }

    // Validar número de documento
    if (!clienteData.numero_documento.trim()) {
        $("#errorNumeroDocumento").text("El número de documento es obligatorio.");
        isValid = false;
    }

    // Validar email solo si es ingresado
    if (clienteData.email && !validateEmail(clienteData.email)) {
        $("#errorEmail").text("El correo electrónico no es válido.");
        isValid = false;
    }

    // Validar teléfono solo si es ingresado
    if (clienteData.telefono && !validatePhone(clienteData.telefono)) {
        $("#errorTelefono").text("El teléfono no es válido.");
        isValid = false;
    }

    if (!isValid) return; // Detener el envío si hay errores

    // Obtener el token CSRF
    const token = $('meta[name="csrf-token"]').attr('content');

    if (clienteId === "") {
        // Crear nuevo cliente
        $.ajax({
            type: "POST",
            url: "/post-clientes",
            data: clienteData,
            headers: {
                'X-CSRF-TOKEN': token  // Agregar token CSRF en los encabezados
            },
            success: function () {
                showToast("Cliente creado exitosamente", "success");
                listarClientes();
                closeModal();
                
            },
            error: function (error) {
                showToast("Error al crear cliente: " + error.responseText, "error");
            }
        });
    } else {
        // Actualizar cliente existente
        $.ajax({
            type: "PUT",
            url: `/put-clientes/${clienteId}`,
            data: clienteData,
            headers: {
                'X-CSRF-TOKEN': token  // Agregar token CSRF en los encabezados
            },
            success: function () {
                showToast("Cliente actualizado exitosamente", "success");
                listarClientes();
                clienteId === ""
                closeModal();
            },
            error: function (error) {
                showToast("Error al actualizar cliente: " + error.responseText, "error");
            }
        });
    }
});

// Función de validación para el correo
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// Función de validación para el teléfono
function validatePhone(phone) {
    const regex = /^[0-9]{10}$/; // Puedes ajustar la validación a tu país
    return regex.test(phone);
}
