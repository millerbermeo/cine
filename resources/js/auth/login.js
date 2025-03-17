import { showToast } from "../toast";

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtener los elementos
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.querySelector(".email-campo");
    const passwordError = document.querySelector(".password-campo");

    // Limpiar mensajes previos
    emailError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    // Validar email
    if (!emailInput.value.trim()) {
        emailError.textContent = "El email es requerido";
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        emailError.textContent = "Ingrese un email válido";
        isValid = false;
    }

    // Validar contraseña
    if (!passwordInput.value.trim()) {
        passwordError.textContent = "La contraseña es requerida";
        isValid = false;
    } else if (passwordInput.value.length < 6) {
        passwordError.textContent = "La contraseña debe tener al menos 6 caracteres";
        isValid = false;
    }

    // Si no es válido, detener el envío
    if (!isValid) return;

    // Enviar formulario con Fetch API si es válido
    const formData = new FormData(this);

    fetch("/post-login", {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": document.querySelector('input[name="_token"]').value,
            "Accept": "application/json",
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al iniciar sesión");
        }
        return response.json();
    })
    .then(data => {
        showToast(data.message, "success");
        window.location.href = data.redirect;
    })
    .catch(error => {
        showToast("Credenciales incorrectas. Inténtelo de nuevo.", "error");

        console.error(error);
    });
});


document.getElementById("submitFormAuth").addEventListener("click", function () {
    const nombre = document.getElementById("modal-nombre").value.trim();
    const email = document.getElementById("modal-email").value.trim();
    const password = document.getElementById("modal-password").value.trim();

    const btnCloseModal = document.getElementById("btn-close-auth");

    if (!nombre || !email || !password) {
        showToast("Todos los campos son obligatorios", "error");
        return;
    }

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('input[name="_token"]').value,
            "Accept": "application/json",
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password,
            password_confirmation: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        showToast("Usuario registrado con éxito", "success");
    })
    .catch(error => console.error("Error:", error));

    id_auth_usuario.close();
});
