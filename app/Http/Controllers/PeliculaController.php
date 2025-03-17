<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pelicula;

class PeliculaController extends Controller
{
    public function index()
    {
        return response()->json(Pelicula::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string|max:255',
            'foto' => 'nullable|string',
            'year' => 'required|integer|min:1900|max:' . date('Y'),
            'trailer_url' => 'nullable|string'
        ]);

        $pelicula = Pelicula::create($request->all());

        return response()->json($pelicula, 201);
    }

    public function show($id)
    {
        return response()->json(Pelicula::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $pelicula = Pelicula::findOrFail($id);
        $pelicula->update($request->all());

        return response()->json($pelicula);
    }

    public function destroy($id)
    {
        Pelicula::destroy($id);
        return response()->json(['message' => 'Película eliminada correctamente']);
    }
}
