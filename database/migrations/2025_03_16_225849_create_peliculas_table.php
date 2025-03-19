<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('peliculas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('categoria');
            $table->string('foto')->nullable();
            $table->year('year');
            $table->string('trailer_url')->nullable();
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->decimal('precio', 10, 2)->default(10000);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('peliculas');
    }
};
