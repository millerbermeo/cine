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
    document.getElementById("nombre").value = "";         // Título de la película
    document.getElementById("descripcion").value = "";    // Descripción (director)
    document.getElementById("categoria").value = "";      // Género
    document.getElementById("year").value = "";           // Año de estreno
    document.getElementById("trailer_url").value = "";    // URL del trailer
    document.getElementById("foto").value = "";           // Foto de la película
};
