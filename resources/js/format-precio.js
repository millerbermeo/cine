export const formatearNumero = (numero, estado) => {
    let numeroStr = estado ? numero : numero.slice(0, -3);

    const regex = /\B(?=(\d{3})+(?!\d))/g;
    return numeroStr.replace(regex, ',');
};
