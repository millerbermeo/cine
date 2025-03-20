<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $fillable = ['cliente_id', 'vendedor_id', 'total_venta'];

    public function cliente()
    {
        return $this->belongsTo(Client::class);
    }

    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }

    public function productosVentas()
    {
        return $this->hasMany(ProductoVenta::class);
    }
}
