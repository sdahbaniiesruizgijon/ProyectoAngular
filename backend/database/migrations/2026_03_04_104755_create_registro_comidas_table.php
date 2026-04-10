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
        // ESTA ES LA LÍNEA QUE TE FALTA:
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
        
        $table->string('alimento');
        $table->integer('calorias');
        $table->integer('proteinas')->default(0);
        $table->integer('carbohidratos')->default(0);
        $table->integer('grasas')->default(0);
        $table->date('fecha');
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
