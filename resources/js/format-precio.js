export const formatearNumero = (numero) => {
    let numeroStr  = numero.slice(0, -3);
    // Agregar el punto cada 3 dígitos desde la derecha
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    return numeroStr.replace(regex, '.');
}

