import { showToast } from "../toast";
import { limpiarValidaciones, validarCampo } from "../validar-inputs";
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
  
        document.getElementById("nombre").classList.remove("input-error");
        document.getElementById("nombreError").innerHTML = "";
   
    
        document.getElementById("apellido").classList.remove("input-error");
        document.getElementById("apellidoError").innerHTML = "";

    

        document.getElementById("identificacion").classList.remove("input-error");
        document.getElementById("identificacionError").innerHTML = "";

        document.getElementById("email").classList.remove("input-error");
        document.getElementById("emailError").innerHTML = "";

    

        document.getElementById("telefono").classList.remove("input-error");
        document.getElementById("telefonoError").innerHTML = "";
  

        document.getElementById("edad").classList.remove("input-error");
        document.getElementById("edadError").innerHTML = "";
  
    
    id_modal_usuario.close(); // Cierra el modal
    limpiarValidaciones()

}
btnOpenModal.addEventListener("click", (e) => {
    openModal();
});
btnCloseModal.addEventListener("click", (e) => {
    closeModal();
    limpiarValidaciones()
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
        const searchWords = searchValue.split(/\s+/); // Divide el término de búsqueda en palabras

        // Filtrar usuarios con base en la búsqueda
        const filteredUsers = users.filter((user) => {
            // Comprobar que cada palabra de la búsqueda esté presente en algún campo del usuario
            return searchWords.every(word => {
                // Comprobar si el campo no es null ni undefined antes de intentar buscar
                return (
                    (user.nombre && user.nombre.toLowerCase().includes(word)) ||
                    (user.apellido && user.apellido.toLowerCase().includes(word)) ||
                    (user.email && user.email.toLowerCase().includes(word)) ||
                    (user.identificacion && user.identificacion.toLowerCase().includes(word)) ||
                    (user.edad && user.edad.toString().toLowerCase().includes(word)) ||
                    (user.telefono && user.telefono.toString().toLowerCase().includes(word)) ||
                    (user.direccion && user.direccion.toLowerCase().includes(word)) ||
                    (user.sexo && user.sexo.toLowerCase().includes(word)) ||
                    (user.nacionalidad && user.nacionalidad.toLowerCase().includes(word))
                );
            });
        });

    const start = (currentPage - 1) * limit;
    const paginatedUsers = filteredUsers.slice(start, start + limit);

    userData.innerHTML = paginatedUsers
        .map(
            (user) => `
        <tr>
            <td class="hidden">${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.apellido ?? ''}</td>
            <td>${user.email}</td>
            <td>${user.identificacion ?? ''}</td>
            <td>${user.edad ?? ''}</td>
            <td>${user.telefono ?? ''}</td>
            <td>${user.direccion ?? ''}</td>
            <td>${user.sexo ?? ''}</td>
            <td>${user.nacionalidad ?? ''}</td>
              <td>
                <label class="swap flex gap-2">
                    ${user.estado === 'activo' ? "Activo" : "Inactivo"}
                    <input type="checkbox" class="toggle toggle-success" 
                        data-user-id="${user.id}" ${user.estado == 'activo' ? "checked" : ""}>
                </label>
            </td>
            <td class="flex  gap-2"><button type="button" class="btn-abrir btn  flex rounded-4xl btn-info text-sm text-white" data-user-id="${user.id}">Editar</button>
                 <button  class="btn  hidden   btn-error rounded-4xl text-sm text-white btn-eliminar-m" data-user-id-delete="${user.id}">Eliminar</button>
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

    document.querySelectorAll(".toggle").forEach((toggle) => {
        toggle.addEventListener("change", function () {
            const userId = this.getAttribute("data-user-id");
            const estado = this.checked ? 'activo' : 'inactivo';
            actualizarEstadoUsuario(userId, estado);
        });
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

    

    // Expresiones regulares para validaciones
    const regexNombreApellido = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[0-9]{7,10}$/;
    const regexEdad = /^[0-9]{1,3}$/;
    
    let isValid = true;
    
    // Validación de nombre
    if (!nombre || !regexNombreApellido.test(nombre)) {
        document.getElementById("nombre").classList.add("input-error");
        document.getElementById("nombreError").innerHTML = '<p class="text-error">El nombre es obligatorio y solo puede contener letras y espacios.</p>';
        isValid = false;
    } else {
        document.getElementById("nombre").classList.remove("input-error");
        document.getElementById("nombreError").innerHTML = "";
    }
    
    // Validación de apellido
    if (!apellido || !regexNombreApellido.test(apellido)) {
        document.getElementById("apellido").classList.add("input-error");
        document.getElementById("apellidoError").innerHTML = '<p class="text-error">El apellido es obligatorio y solo puede contener letras y espacios.</p>';
        isValid = false;
    } else {
        document.getElementById("apellido").classList.remove("input-error");
        document.getElementById("apellidoError").innerHTML = "";
    }
    
    // Validación de identificación
    const identificacionNum = parseInt(identificacion, 10);
    if (!identificacion || isNaN(identificacionNum) || identificacionNum <= 0) {
        document.getElementById("identificacion").classList.add("input-error");
        document.getElementById("identificacionError").innerHTML = '<p class="text-error">La identificación es obligatoria y debe ser un número entero válido.</p>';
        isValid = false;
    } else {
        document.getElementById("identificacion").classList.remove("input-error");
        document.getElementById("identificacionError").innerHTML = "";
    }
    // Validación de email
    if (!email || !regexEmail.test(email)) {
        document.getElementById("email").classList.add("input-error");
        document.getElementById("emailError").innerHTML = '<p class="text-error">Ingrese un correo válido.</p>';
        isValid = false;
    } else {
        document.getElementById("email").classList.remove("input-error");
        document.getElementById("emailError").innerHTML = "";
    }
    
    // Validación de teléfono
    if (!telefono || !regexTelefono.test(telefono)) {
        document.getElementById("telefono").classList.add("input-error");
        document.getElementById("telefonoError").innerHTML = '<p class="text-error">El teléfono debe contener entre 7 y 10 dígitos.</p>';
        isValid = false;
    } else {
        document.getElementById("telefono").classList.remove("input-error");
        document.getElementById("telefonoError").innerHTML = "";
    }
    
    // Validación de edad
    const edadNum = parseInt(edad, 10);
    if (!edad || !regexEdad.test(edad) || edadNum < 0 || edadNum > 120) {
        document.getElementById("edad").classList.add("input-error");
        document.getElementById("edadError").innerHTML = '<p class="text-error">Ingrese una edad válida (entre 0 y 120).</p>';
        isValid = false;
    } else {
        document.getElementById("edad").classList.remove("input-error");
        document.getElementById("edadError").innerHTML = "";
    }
    
    // Si alguna validación falla, detener el proceso
    if (!isValid) {
        return;
    }
    

    // Crear objeto de datos para enviar
    const data = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        identificacion: identificacion,
        telefono: telefono,
        edad: edad,
        direccion: direccion,
        sexo: sexo,
        nacionalidad: nacionalidad,
        foto: "photo.jpg",
        estado: "activo",
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
                limpiarFormulario();
                listarUsuarios(); // Actualizar la lista de usuarios
            })
            .catch((error) => {
                console.error("Error:", error);
                showToast("No se pudo actualizar el usuario", "error");
            });
    } else {
        // Crear usuario
        axios
            .post("/post-usuarios", data)
            .then((response) => {
                console.log("Usuario creado:", response.data);
                showToast("Usuario creado con éxito", "success");
                document.getElementById("id_modal_usuario").close();
                limpiarFormulario();
                listarUsuarios(); // Actualizar la lista de usuarios
            })
            .catch((error) => {
                const mensajeError = error.response.data.message || "Ocurrió un error inesperado";
                // showToast(mensajeError, "error");
                document.getElementById("email").classList.add("input-error");
                document.getElementById("emailError").innerHTML = '<p class="text-error">Email ya esta en uso</p>';
                // Si hay errores específicos (como email ya registrado)
                if (error.response.data.errors) {
                    const errores = error.response.data.errors;
                    const detalles = Object.values(errores).flat().join(", "); // Convertir a texto legible
                    showToast(`${mensajeError}: ${detalles}`, "error");
                } else {
                    showToast(mensajeError, "error");
                    document.getElementById("email").classList.add("input-error");
                    document.getElementById("emailError").innerHTML = '<p class="text-error">Email ya esta en uso</p>';
                }
            });
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

    const actualizarEstadoUsuario = (id, estado) => {
        console.log(estado)
        fetch(`/put-usuarios/${id}/estado`, {
            
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify({ estado }),
        })
              .then((response) => response.json())
                    .then((data) => {
                        showToast(
                            `Usuario ${
                                estado ? "activada" : "desactivada"
                            } con éxito`,
                            "success"
                        );
                        listarUsuarios()
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        showToast("Error al actualizar el estado del Usuario", "error");
                    });
    };
    