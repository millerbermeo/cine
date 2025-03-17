export const formatFecha = (fecha) => {

    const dateObj = new Date(fecha);
    
    // Obtener los componentes de la fecha
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = dateObj.getFullYear();
    
    // Obtener los componentes de la hora
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convertir la hora a formato de 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // El 0 debe convertirse en 12

    // Construir la fecha formateada
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${period}`;
}


