<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pelicula;

class PeliculaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        $users = Pelicula::orderBy('created_at', 'desc')->get();

        return response()->json( $users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string',
            'year' => 'required|integer',
            'trailer_url' => 'nullable',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('peliculas', 'public'); // Guarda en storage/app/public/peliculas
        }
    
        $pelicula = Pelicula::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'categoria' => $request->categoria,
            'year' => $request->year,
            'trailer_url' => $request->trailer_url,
            'foto' => $fotoPath,
        ]);
    
        return response()->json(['message' => 'Película guardada', 'pelicula' => $pelicula]);
    }
    

    public function show($id)
    {
        return response()->json(Pelicula::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        // Encuentra la película por su ID
        $pelicula = Pelicula::findOrFail($id);
    
        // Validación de los datos
      
    
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('peliculas', 'public'); 
        }
    
        // Actualizar los datos de la película
        $pelicula->update([
            'nombre' => $request->nombre ?? $pelicula->nombre,
            'descripcion' => $request->descripcion,
            'categoria' => $request->categoria ?? $pelicula->categoria,
            'year' => $request->year ?? $pelicula->year,
            'trailer_url' => $request->trailer_url,
            'foto' => $fotoPath, // Si se subió una foto nueva, se guarda la ruta
        ]);
    
        // Retornar la respuesta
        return response()->json(['message' => 'Película actualizada con éxito', 'pelicula' => $pelicula]);
    }
    

    public function destroy($id)
    {
        Pelicula::destroy($id);
        return response()->json(['message' => 'Película eliminada correctamente']);
    }
}
