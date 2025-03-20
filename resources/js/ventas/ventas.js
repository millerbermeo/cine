import { formatearNumero } from "../format-precio";

$(document).ready(function () {
    listarVentas();
});

let ventas = [];
let currentPage = 1;
let limit = parseInt($("#limitSelect").val());

function renderTable() {
    const ventasData = $("#ventasData");
    const searchValue = $("#searchInput").val().toLowerCase();
    
    const filteredVentas = ventas.filter(venta => 
        venta.cliente.nombre.toLowerCase().includes(searchValue) ||
        venta.vendedor.nombre.toLowerCase().includes(searchValue)
    );

    const start = (currentPage - 1) * limit;
    const paginatedVentas = filteredVentas.slice(start, start + limit);

    ventasData.html(
        paginatedVentas.map(venta => `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.cliente.nombre}</td>
                <td>${venta.vendedor.nombre}</td>
                <td>${new Date(venta.created_at).toLocaleDateString()}</td>
                <td>
                    <ul>
                        ${venta.productos_ventas.map(item => `<li>${item.pelicula.nombre} (x${item.cantidad})</li>`).join('')}
                    </ul>
                </td>
                <td>$${formatearNumero(venta.total_venta)}</td>
            </tr>
        `).join("")
    );

    renderPagination(filteredVentas.length);
}

function renderPagination(totalVentas) {
    const paginationContainer = $("#pagination");
    paginationContainer.empty();
    const totalPages = Math.ceil(totalVentas / limit);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const $button = $(`<input type="radio" name="pagination" class="join-item btn btn-square" aria-label="${i}" value="${i}">`);

        if (i === currentPage) $button.prop("checked", true);

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

$("#limitSelect").on("change", function () {
    limit = parseInt($(this).val());
    currentPage = 1;
    renderTable();
});

function listarVentas() {
    $.get("/get-ventas", function (data) {
        ventas = data;
        renderTable();
    });
}
