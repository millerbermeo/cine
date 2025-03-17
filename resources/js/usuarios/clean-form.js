export const limpiarFormulario = () => {
    // document.getElementById("userId").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("identificacion").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("sexoSelect").value = "";
    document.getElementById("nacionalidadSelect").value = "";
    document.getElementById("password").value = "";
};

export const limpiarFormularioPeliculas = () => {
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("year").value = "";
    document.getElementById("trailer_url").value = "";
    document.getElementById("foto").value = "";
};
