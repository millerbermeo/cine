import { showToast } from "../toast";
import { limpiarFormulario } from "./clean-form";
import { formatFecha } from "./format-date";

document.addEventListener("DOMContentLoaded", function () {
    listarUsuarios();
});

// FUNCIONES PARA LOS MODALS
let identificador = "";
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
function mostrarModalEliminar(id) {
    const modalEliminar = document.getElementById("modal_eliminar_usuario");
    identificador = id;
    modalEliminar.showModal();
}
function openModal() {
    id_modal_usuario.showModal();

    limpiarFormulario();
}
function closeModal() {
    id_modal_usuario.close(); // Cierra el modal
}
btnOpenModal.addEventListener("click", (e) => {
    openModal();
});
btnCloseModal.addEventListener("click", (e) => {
    closeModal();
    limpiarFormulario();
});

//FUNCIONES PARA LA DATATABLE

let users = [];
let currentPage = 1;
let limit = parseInt(document.getElementById("limitSelect").value);
const renderTable = () => {
    const userData = document.getElementById("userData");
    const searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase();
    const filteredUsers = users.filter(
        (user) =>
            user.nombre.toLowerCase().includes(searchValue) ||
            user.apellido.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
    );

    const start = (currentPage - 1) * limit;
    const paginatedUsers = filteredUsers.slice(start, start + limit);

    userData.innerHTML = paginatedUsers
        .map(
            (user) => `
        <tr>
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.apellido}</td>
            <td>${user.email}</td>
            <td>${user.identificacion}</td>
            <td>${user.edad}</td>
            <td>${user.telefono}</td>
            <td>${user.direccion}</td>
            <td>${user.sexo}</td>

      
            <td>${user.nacionalidad}</td>
            <td class="flex gap-2"><button type="button" class="btn-abrir btn  flex btn-active rounded-full  w-12 btn-info text-xs text-white" data-user-id="${user.id}">Editar</button>
                 <button  class="btn  flex btn-active w-12 btn-error rounded-full text-xs text-white btn-eliminar-m" data-user-id-delete="${user.id}">Eliminar</button>
            </td>
        </tr>
    `
        )
        .join("");

    // Delegar el evento al contenedor principal
    userData.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-abrir")) {
            const id = e.target.getAttribute("data-user-id");
            obtenerUsuario(id);
        }
    });

    userData.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("btn-eliminar-m")) {
            const id = e.target.getAttribute("data-user-id-delete");
            mostrarModalEliminar(id);
        }
    });

    renderPagination(filteredUsers.length);
};

function renderPagination(totalUsers) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalUsers / limit);

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

// FUNCION QUE LISTA LOS USUARIOS
const listarUsuarios = () => {
    fetch("/get-usuarios")
        .then((response) => response.json())
        .then((data) => {
            users = data;
            renderTable();
        })
        .catch((error) =>
            console.error("Error al obteyner los usuarios:", error)
        );
};

// FUNCIONE QUE OBTIENE UN USUARIO
const obtenerUsuario = (id) => {
    fetch(`/get-usuarios/${id}`)
        .then((response) => response.json())
        .then((data) => {
            // Aquí se asignan los valores a los campos del formulario
            document.getElementById("userId").value = data.id;
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("apellido").value = data.apellido;
            document.getElementById("identificacion").value =
                data.identificacion;
            document.getElementById("email").value = data.email;
            document.getElementById("telefono").value = data.telefono;
            document.getElementById("edad").value = data.edad;
            document.getElementById("direccion").value = data.direccion;
            document.getElementById("sexoSelect").value = data.sexo;
            document.getElementById("nacionalidadSelect").value =
                data.nacionalidad;

            id_modal_usuario.showModal();
        })
        .catch((error) =>
            console.error("Error al obtener los usuarios:", error)
        );
};

// REGISTRAR O ACTUALIZAR UN USUARIO
document.getElementById("submitForm").addEventListener("click", function () {
    // Obtener los valores de los campos del formulario
    const userId = document.getElementById("userId").value; // ID del usuario (si existe)
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const identificacion = document.getElementById("identificacion").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const edad = document.getElementById("edad").value;
    const direccion = document.getElementById("direccion").value;
    const sexo = document.getElementById("sexoSelect").value;
    const nacionalidad = document.getElementById("nacionalidadSelect").value;
    const password = document.getElementById("password").value;

    // Verificar que todos los campos obligatorios estén completos
    if (!nombre || !identificacion || !email) {
        alert("Por favor, complete los campos obligatorios.");
        return;
    }

    // Crear objeto de datos para enviar
    const data = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password, // Añadir la contraseña
        identificacion: identificacion,
        telefono: telefono,
        edad: edad,
        direccion: direccion,
        sexo: sexo,
        nacionalidad: nacionalidad,
        foto: "path/to/photo.jpg", // Aquí podrías incluir la foto si es necesario
        estado: "activo", // Suponiendo que el estado inicial del usuario sea activo
    };

    // Si hay un userId, significa que es una actualización
    if (userId) {
        // Actualizar usuario
        data.id = userId; // Incluir el ID del usuario
        axios
            .put(`/put-usuarios/${userId}`, data)
            .then((response) => {
                console.log("Usuario actualizado:", response.data);
                showToast("Usuario actualizado con éxito", "success");
                document.getElementById("id_modal_usuario").close();
                listarUsuarios(); // Actualizar la lista de usuarios
            })
            .catch((error) => {
                console.error("Error:", error);
                showToast("No se pudo actualizar el usuario", "error");
            });

        limpiarFormulario();
    } else {
        // Crear usuario
        axios
            .post("/post-usuarios", data)
            .then((response) => {
                console.log("Usuario creado:", response.data);
                showToast("Usuario creado con éxito", "success");
                document.getElementById("id_modal_usuario").close();
                listarUsuarios(); // Actualizar la lista de usuarios
            })
            .catch((error) => {
                console.error("Error:", error);
                showToast("No se pudo registrar el usuario", "error");
            });

        limpiarFormulario();
    }
});

// FUNCION PARA ELIMINAR UN USUARIO
document
    .getElementById("btn-confirmar-eliminar")
    .addEventListener("click", function () {
        console.log(identificador);
        fetch(`/delete-usuarios/${identificador}`, {
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
                    throw new Error("Error al eliminar el usuario");
                }
                return response.json();
            })
            .then((data) => {
                showToast(data.message, "success");
                listarUsuarios(); // Actualiza la tabla después de eliminar
                document.getElementById("modal_eliminar_usuario").close();
            })
            .catch((error) => console.error("Error:", error));
    });
