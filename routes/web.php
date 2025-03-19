<?php

// web.php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PeliculaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas para autenticación
|--------------------------------------------------------------------------
*/

// Ruta para la vista de login
Route::get('/', [AuthController::class, 'index'])->name('login');

// Ruta para el login (POST)
Route::post('/post-login', [AuthController::class, 'login'])->name('auth.login');

Route::post('/register', [AuthController::class, 'register'])->name('register');


// Ruta para cerrar sesión
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| Rutas protegidas por autenticación
|--------------------------------------------------------------------------
*/

// Estas rutas estarán protegidas por el middleware 'auth'
// Solo los usuarios autenticados pueden acceder a ellas

Route::middleware('auth')->group(function () {
    // Ruta para la vista de inicio (Dashboard)
    Route::get('/home', function () {
        return view('admin.home');
    })->name('home');



    // Ruta para la vista de usuarios
    Route::get('/usuarios', function () {
        return view('admin.usuarios');
    });
    Route::get('/peliculas', function () {
        return view('admin.peliculas');
    });

    Route::get('/categorias', function () {
        return view('admin.categoria');
    });

    // Rutas para la API de usuarios
    Route::get('/get-usuarios', [UserController::class, 'index']); // Obtener todos los usuarios
    Route::get('/get-usuarios/{id}', [UserController::class, 'show']); // Obtener un usuario por ID
    Route::post('/post-usuarios', [UserController::class, 'store']); // Crear un nuevo usuario
    Route::put('/put-usuarios/{id}', [UserController::class, 'update']); // Actualizar un usuario
    Route::delete('/delete-usuarios/{id}', [UserController::class, 'destroy']); // Eliminar un usuario
    Route::patch('/put-usuarios/{id}/estado', [UserController::class, 'changeStatus']);


    Route::get('/get-peliculas', [PeliculaController::class, 'index']);
    Route::post('/post-peliculas', [PeliculaController::class, 'store']);
    Route::get('/get-peliculas/{id}', [PeliculaController::class, 'show']);
    Route::put('/put-peliculas/{id}', [PeliculaController::class, 'update']);
    Route::delete('/delete-peliculas/{id}', [PeliculaController::class, 'destroy']);
    Route::patch('/put-peliculas/{id}/estado', [PeliculaController::class, 'changeStatus']);


    Route::get('/get-categorias', [CategoriaController::class, 'index']); // Obtener todas las categorías
    Route::post('/post-categorias', [CategoriaController::class, 'store']); // Crear una nueva categoría
    Route::get('/get-categorias/{id}', [CategoriaController::class, 'show']); // Obtener una categoría por ID
    Route::put('/put-categorias/{id}', [CategoriaController::class, 'update']); // Actualizar una categoría
    Route::delete('/delete-categorias/{id}', [CategoriaController::class, 'destroy']); // Eliminar una categoría
    Route::patch('/categoria/{id}/estado', [CategoriaController::class, 'updateStatus'])->name('categoria.updateStatus');

});
