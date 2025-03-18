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

    public function index(Request $request)
    {
        // Determinamos el número de elementos por página
        $perPage = 20;
    
        // Recuperamos las películas de 20 en 20, ordenadas por la fecha de creación
        $peliculas = Pelicula::orderBy('created_at', 'desc')->paginate($perPage);
    
        // Retornamos las películas como respuesta JSON, incluyendo la información de paginación
        return response()->json($peliculas);
    }
    
    public function index2()
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
            'foto' => 'nullable',
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

        $pelicula = Pelicula::findOrFail($id);
        
        $pelicula->update([
            'nombre' => $request->nombre ?? $pelicula->nombre,
            'descripcion' => $request->descripcion,
            'categoria' => $request->categoria ?? $pelicula->categoria,
            'year' => $request->year ?? $pelicula->year,
            'trailer_url' => $request->trailer_url,
        ]);
    
        return response()->json($pelicula);
    }
    
    

    public function destroy($id)
    {
        Pelicula::destroy($id);
        return response()->json(['message' => 'Película eliminada correctamente']);
    }
}
