<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Obtener todos los usuarios
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    // Obtener un usuario por ID
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user);
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'string|max:255',
            'email' => 'required|email|unique:users,email',

        ]);

        $user = new User();
        $user->nombre = $request->nombre;
        $user->apellido = $request->apellido;
        $user->email = $request->email;
        $user->identificacion = $request->identificacion;
        $user->password = bcrypt($request->password ?? $request->identificacion);
        $user->edad = $request->edad;
        $user->telefono = $request->telefono;
        $user->direccion = $request->direccion;
        $user->sexo = $request->sexo;
        $user->foto = $request->foto;
        $user->estado = $request->estado;
        $user->nacionalidad = $request->nacionalidad;
        $user->save();

        return response()->json(['message' => 'Usuario creado con éxito', 'user' => $user], 201);
    }

    // Actualizar un usuario
    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->nombre = $request->input('nombre');
        $user->apellido = $request->input('apellido');
        $user->email = $request->input('email');

        // Verificar si se proporcionó una nueva contraseña
        if ($request->filled('password')) {
            $user->password = bcrypt($request->input('password'));
        }

        $user->identificacion = $request->input('identificacion');
        $user->telefono = $request->input('telefono');
        $user->edad = $request->input('edad');
        $user->direccion = $request->input('direccion');
        $user->sexo = $request->input('sexo');
        $user->nacionalidad = $request->input('nacionalidad');
        $user->foto = $request->input('foto'); // Si es necesario

        $user->save();

        return response()->json(['success' => true]);
    }


    // Eliminar un usuario
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }

    // Cambiar el estado de un usuario (activo/inactivo)
    public function changeStatus($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Alternar entre 'activo' e 'inactivo'
        $user->estado = $user->estado === 'activo' ? 'inactivo' : 'activo';
        $user->save();

        return response()->json(['message' => 'Estado actualizado con éxito', 'estado' => $user->estado]);
    }
}
