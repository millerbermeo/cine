<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'tipo_documento',
        'numero_documento',
        'email',
        'telefono',
        'estado',
    ];
}
