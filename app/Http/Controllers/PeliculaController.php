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

    // public function index(Request $request)
    // {
    //     // Determinamos el número de elementos por página
    //     $perPage = 20;
    
    //     $query = Pelicula::orderBy('year', 'asc');
    
    //     // Filtrar por rango de años
    //     if ($request->has('fecha1') && $request->has('fecha2')) {
    //         $query->whereBetween('year', [$request->fecha1, $request->fecha2]);
    //     }
    
    //     $peliculas = $query->paginate($perPage);
    
    //     return response()->json($peliculas);
    // }
    public function index(Request $request)
    {
        // Si se solicita una exportación, no aplicar paginación
        $export = $request->has('export') && $request->export === 'true';
    
        $query = Pelicula::orderBy('year', 'asc');
    
        // Filtrar por rango de años si se pasan fecha1 y fecha2
        if ($request->has('fecha1') && $request->has('fecha2')) {
            $query->whereBetween('year', [$request->fecha1, $request->fecha2]);
        }
    
        // Filtrar por búsqueda (nombre, descripción, o categoría) solo sobre el resultado filtrado por año
        if ($request->has('search') && $search = $request->search) {
            $search = strtolower($search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(descripcion) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(categoria) = ?', [$search]);
            });
        }
    
        // Filtrar por categoría (si se pasa una categoría)
        if ($request->has('categoria') && $categoria = $request->categoria) {
            $categoria = strtolower($categoria); // Asegúrate de comparar sin distinción de mayúsculas/minúsculas
            $query->whereRaw('LOWER(categoria) = ? AND year BETWEEN ? AND ?', [$categoria, $request->fecha1, $request->fecha2]);
        }
    
        // Si es exportación, obtener todos los resultados en lotes
        if ($export) {
            $perPage = 50; // Lote de 50 registros
            $peliculas = $query->paginate($perPage);
    
            return response()->json($peliculas);
        } else {
            // Si no es exportación, aplicar paginación normal
            $perPage = 20;
            $peliculas = $query->paginate($perPage);
            return response()->json($peliculas);
        }
    }
    
    
    
    
    
    // public function index2()
    // {
    //     $users = Pelicula::orderBy('created_at', 'desc')->get();

    //     return response()->json( $users);
    // }
    

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

    public function changeStatus($id)
{
    // Buscar la película por su ID
    $pelicula = Pelicula::find($id);

    if (!$pelicula) {
        return response()->json(['message' => 'Película no encontrada'], 404);
    }

    // Alternar entre 'activo' e 'inactivo'
    $pelicula->estado = $pelicula->estado === 'activo' ? 'inactivo' : 'activo';
    $pelicula->save();

    return response()->json(['message' => 'Estado actualizado con éxito', 'estado' => $pelicula->estado]);
}

}
