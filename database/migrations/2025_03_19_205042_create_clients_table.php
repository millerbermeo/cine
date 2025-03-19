<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo_documento');
            $table->string('numero_documento')->unique();
            $table->string('email')->nullable(true)->unique();
            $table->string('telefono')->nullable(true);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');  // Campo agregado
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
