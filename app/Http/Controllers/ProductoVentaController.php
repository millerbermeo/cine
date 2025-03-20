<?php

namespace App\Http\Controllers;

use App\Models\ProductoVenta;
use Illuminate\Http\Request;

class ProductoVentaController extends Controller
{
    public function index()
    {
        return ProductoVenta::with(['venta', 'pelicula'])->get();
    }
}
