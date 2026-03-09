<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistroComidaController;
use App\Http\Controllers\DiarioController;


Route::apiResource('comidas', RegistroComidaController::class);
Route::apiResource('diarios', DiarioController::class);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
