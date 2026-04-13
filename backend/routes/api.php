<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http; 
use App\Http\Controllers\RegistroComidaController;
use App\Http\Controllers\DiarioController;
use App\Http\Controllers\AuthController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Ruta puente para evitar errores de CORS al consultar la API externa
Route::get('/buscar-alimento', function (Request $request) {
    $query = $request->query('q', 'apple'); 
    
    $response = Http::get("https://world.openfoodfacts.org/cgi/search.pl", [
        'search_terms' => $query,
        'action' => 'process',
        'json' => 1,
        'page_size' => 10
    ]);

    return $response->json();
});


Route::middleware('auth:sanctum')->group(function () {
    
    // CRUD completo de Comidas 
    Route::apiResource('comidas', RegistroComidaController::class);
    
    // CRUD completo de Diarios
    Route::apiResource('diarios', DiarioController::class);
    
    // Cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    // Obtener datos del usuario identificado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});