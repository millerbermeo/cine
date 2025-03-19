<?php

// app/Http/Controllers/ClientController.php
namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    // Obtener todos los clientes
    public function index()
    {
        return response()->json(Client::all());
    }

    // Obtener un cliente por ID
    public function show($id)
    {
        $client = Client::findOrFail($id);
        return response()->json($client);
    }

    // Crear un nuevo cliente
    public function store(Request $request)
    {
        // $request->validate([
        //     'nombre' => 'required|string|max:255',
        //     'tipo_documento' => 'required|string|max:20',
        //     'numero_documento' => 'required|string|max:20|unique:clients',
        //     'email' => 'required|email|unique:clients',
        //     'telefono' => 'required|string|max:20',
        //     'estado' => 'required|in:activo,inactivo',
        // ]);

        $client = Client::create($request->all());

        return response()->json($client, 201);
    }

    // Actualizar un cliente
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'tipo_documento' => 'string|max:20',
            'numero_documento' => 'string|max:20|unique:clients,numero_documento,' . $id,
            'email' => 'email|unique:clients,email,' . $id,
            'telefono' => 'string|max:20',
            'estado' => 'in:activo,inactivo',
        ]);

        $client = Client::findOrFail($id);
        $client->update($request->all());

        return response()->json($client);
    }

    // Eliminar un cliente
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json(['message' => 'Cliente eliminado']);
    }

    // Cambiar el estado de un cliente
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:activo,inactivo',
        ]);

        $client = Client::findOrFail($id);
        $client->estado = $request->estado;
        $client->save();

        return response()->json($client);
    }
}
