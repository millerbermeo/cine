<?php

namespace App\Http\Controllers;

use App\Models\Pelicula;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function index()
    {
        return Venta::with(['cliente', 'vendedor', 'productosVentas.pelicula'])
        ->orderBy('id', 'desc')
        ->get();
    
    }

    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clients,id',
            'vendedor_id' => 'required|exists:users,id',
            'productos' => 'required|array',
            'productos.*.pelicula_id' => 'required|exists:peliculas,id',
            'productos.*.cantidad' => 'required|integer|min:1'
        ]);

        $venta = Venta::create([
            'cliente_id' => $request->cliente_id,
            'vendedor_id' => $request->vendedor_id,
            'total_venta' => collect($request->productos)->sum(function ($p) {
                $pelicula = Pelicula::find($p['pelicula_id']);
                return $pelicula ? ($p['cantidad'] * $pelicula->precio) : 0;
            })
        ]);

        foreach ($request->productos as $producto) {
            $venta->productosVentas()->create([
                'pelicula_id' => $producto['pelicula_id'],
                'cantidad' => $producto['cantidad']
            ]);
        }

        return response()->json($venta->load('productosVentas.pelicula'), 201);
    }
}
