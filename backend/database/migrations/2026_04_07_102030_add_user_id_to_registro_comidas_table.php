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
    Schema::table('registro_comidas', function (Blueprint $table) {
        // Añadimos la columna user_id como clave foránea
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('registro_comidas', function (Blueprint $table) {
        $table->dropColumn('user_id');
    });
}
};
