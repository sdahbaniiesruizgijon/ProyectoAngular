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
        Schema::create('registro_comidas', function (Blueprint $table) {
        $table->id();
        $table->string('alimento');
        $table->integer('calorias');
        $table->float('proteinas')->default(0);      // <-- AÑADE ESTO
        $table->float('carbohidratos')->default(0);  // <-- AÑADE ESTO
        $table->float('grasas')->default(0);         // <-- AÑADE ESTO
        $table->date('fecha')->nullable();           // La hacemos nullable por si no envías fecha
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_comidas');
    }
};
