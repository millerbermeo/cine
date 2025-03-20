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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('cliente_id')->constrained('clients')->onDelete('cascade'); // Relación con clientes
            $table->foreignId('vendedor_id')->constrained('users')->onDelete('cascade');   // Relación con usuarios
            $table->decimal('total_venta', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
