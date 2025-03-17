<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
	* Función mostrar vista inicial 
	*/
	public function index()
	{
	    // se verifica que el usuarios este logueado
	    if (Auth::check()) {
	
            return redirect()->route('home');  // Utiliza el nombre de la ruta aquí

	    }
	
	    // retornar login si no hay un inicio de session
	    return view('auth.login');
	}

    public function register(Request $request)
{
    // Validar datos
    $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|confirmed',
    ]);

    try {
        // Crear usuario
        $user = User::create([
            'nombre' => $request->nombre, // Nombre del usuario
            'email' => $request->email, // Correo electrónico
            'password' => Hash::make($request->password), // Hash de la contraseña
        ]);

        return response()->json(['message' => 'Usuario registrado con éxito'], 201);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al registrar usuario', 'error' => $e->getMessage()], 500);
    }
}
	
    /**
	* login
	*/
	public function login(Request $request)
{
    // Validamos los datos del request
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // Almacenamos las credenciales de email y contraseña
    $credentials = $request->only('email', 'password');

    // Intentamos autenticar al usuario
    try {
        if (Auth::attempt($credentials)) {
            return response()->json(['message' => 'Login successful', 'redirect' => '/home']);
        }
        return response()->json(['message' => 'Credenciales incorrectas.'], 400);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al procesar la solicitud', 'error' => $e->getMessage()], 500);
    }
    
}

	
    
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/')->withSuccess('Sesión cerrada correctamente.');
    }
    

}