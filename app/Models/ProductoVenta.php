<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductoVenta extends Model
{
    use HasFactory;

    protected $table = 'productos_ventas'; // Nombre correcto de la tabla


    protected $fillable = ['venta_id', 'pelicula_id', 'cantidad'];

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function pelicula()
    {
        return $this->belongsTo(Pelicula::class);
    }
}
