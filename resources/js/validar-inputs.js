export const validarCampo = (idInput, idError, mensaje, errorClass = "input-error") => {
    const input = document.getElementById(idInput);
    const error = document.getElementById(idError);

    if (!input.value.trim()) {
        error.textContent = mensaje;
        error.classList.add("text-red-500");
        input.classList.add(errorClass);
        return false;
    } else {
        error.textContent = "";
        error.classList.remove("text-red-500");
        input.classList.remove(errorClass);
        return true;
    }
}

export const limpiarValidaciones = (ids) => {
    ids.forEach(({ idInput, idError, errorClass = "input-error" }) => {
        const input = document.getElementById(idInput);
        const error = document.getElementById(idError);

        if (input && error) {
            error.textContent = "";
            error.classList.remove("text-red-500");
            input.classList.remove(errorClass);
        }
    });
};
