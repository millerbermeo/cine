@extends('layouts.ventas')

@section('content')

<div class="flex justify-between items-center mb-2">
    <label class="input flex items-center border outline-none rounded-md px-3 py-2 bg-gray-50">
        <svg class="h-4 w-4 opacity-50 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input type="search" id="searchInput" class="outline-none bg-transparent text-sm" placeholder="Buscar venta...">
    </label>

    <select id="limitSelect" class="border px-3 py-2 rounded-md w-36">
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="20">20</option>
    </select>
</div>

<div class="overflow-x-auto w-full">
    <table id="ventasTable" class="table table-zebra border-separate p-5 rounded-2xl bg-white">
        <thead class="bg-success text-sm text-white h-10">
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Fecha de Venta</th>
                <th>Películas Vendidas</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody id="ventasData"></tbody>
    </table>
</div>

<div id="pagination" class="join w-full justify-end mt-4"></div>

@endsection


