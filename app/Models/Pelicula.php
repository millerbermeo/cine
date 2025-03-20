<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelicula extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'categoria',
        'foto',
        'year',
        'trailer_url',
        'estado',
        'precio', // Añadimos el campo precio
    ];

    protected $attributes = [
        'estado' => 'activo', // Valor por defecto
        'precio' => 10000, // Valor por defecto
    ];

    public function productosVentas()
    {
        return $this->hasMany(ProductoVenta::class);
    }
}