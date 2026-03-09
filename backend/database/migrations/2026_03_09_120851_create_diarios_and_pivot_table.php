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
        // Tabla para los "Blogs" o "Agendas"
        Schema::create('diarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->date('fecha');
            $table->timestamps();
        });

        Schema::create('diario_alimento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diario_id')->constrained('diarios')->onDelete('cascade');
            $table->foreignId('registro_comida_id')->constrained('comidas')->onDelete('cascade');
            $table->integer('cantidad_gramos')->default(100); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diario_alimento');
        Schema::dropIfExists('diarios');
    }
};
