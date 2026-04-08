<?php

namespace App\Http\Controllers;

use App\Models\RegistroComida;
use Illuminate\Http\Request;

class RegistroComidaController extends Controller
{
    public function index()
    {
        return RegistroComida::all();
    }

public function store(Request $request) {
    if (!$request->user()) {
        return response()->json(['message' => 'No autenticado'], 401);
    }

    return $request->user()->comidas()->create([
        'alimento'      => $request->alimento,
        'calorias'      => $request->calorias,
        'proteinas'     => $request->proteinas ?? 0,
        'carbohidratos' => $request->carbohidratos ?? 0,
        'grasas'        => $request->grasas ?? 0,
        'fecha'         => $request->fecha ?? now(), // Si no hay fecha, usa la de hoy
    ]);
}

    public function show($id)
    {
        return RegistroComida::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comida = RegistroComida::findOrFail($id);
        $comida->update($request->all());
        return $comida;
    }

    public function destroy($id)
    {
        RegistroComida::destroy($id);
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}