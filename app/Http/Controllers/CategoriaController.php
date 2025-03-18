<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    // Obtener todas las categorías
    public function index()
    {
        $categorias = Categoria::orderBy('created_at', 'desc')->get();
        return response()->json($categorias);
    }

    // Obtener una categoría por ID
    public function show($id)
    {
        $categoria = Categoria::find($id);
        return response()->json($categoria);
    }

    // Crear una nueva categoría
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);
    
        $nombre = strtolower(trim($request->nombre));
        $categoriaExistente = Categoria::whereRaw('LOWER(nombre) = ?', [$nombre])->first();
    
        if ($categoriaExistente) {
            return response()->json(['message' => 'La categoría ya existe.'], 400);
        }
    
        // Crear la nueva categoría si no existe
        $categoria = Categoria::create([
            'nombre' => $nombre,  // Asegúrate de almacenar el nombre en minúsculas
        ]);
    
        return response()->json($categoria, 201);
    }
    
    // Actualizar una categoría
    public function update(Request $request, $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $categoria->update($request->all());
        return response()->json($categoria);
    }

    // Eliminar una categoría
    public function destroy($id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $categoria->delete();
        return response()->json(['message' => 'Categoría eliminada con éxito']);
    }


    public function updateStatus($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        // Cambiar el valor de 'estado' (si es true lo ponemos en false y viceversa)
        $categoria->estado = !$categoria->estado;
        $categoria->save();

        return response()->json([
            'message' => 'Categoría ' . ($categoria->estado ? 'activada' : 'desactivada') . ' con éxito',
            'categoria' => $categoria
        ]);
    }
}
