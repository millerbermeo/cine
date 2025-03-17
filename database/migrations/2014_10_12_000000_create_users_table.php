<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('identificacion')->unique()->nullable();
            $table->integer('edad')->nullable();
            $table->string('telefono')->nullable();
            $table->text('direccion')->nullable();
            $table->string('sexo')->nullable();
            $table->string('foto')->nullable();
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->string('nacionalidad')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
