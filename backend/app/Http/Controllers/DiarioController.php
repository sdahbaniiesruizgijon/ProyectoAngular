<?php

namespace App\Http\Controllers;


use App\Models\diarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;


class DiarioController extends Controller
{
    public function index()
{
    // Cambiamos Auth::id() por 1 para que veas los datos del usuario 1
    return \App\Models\diarios::with('alimentos')->where('user_id', 1)->get();
}

public function store(Request $request)
{
    // 1. Creamos el diario
    $diario = diarios::create([
        'user_id' => 1, 
        'titulo' => $request->titulo,
        'fecha' => $request->fecha,
        'descripcion' => $request->descripcion ?? 'Entrada de diario'
    ]);

    // 2. Procesamos el array de alimentos que viene de Angular
    if ($request->has('alimentos') && is_array($request->alimentos)) {
        
        $formateados = [];
        foreach ($request->alimentos as $item) {
            // El ID del alimento es la clave, y la cantidad_gramos va al pivote
            $formateados[$item['id']] = ['cantidad_gramos' => $item['cantidad']];
        }

        // Attach múltiple para guardar todos de una vez
        $diario->alimentos()->attach($formateados);
    }

    // Cargamos la relación y los totales (accessor) para devolverlo completo
    return response()->json($diario->load('alimentos'), 201);
}
    public function show($id)
    {
        return diarios::with('alimentos')->findOrFail($id);
    }

    // Borrar un blog completo
    public function destroy($id)
    {
        $diario = diarios::findOrFail($id);
        $diario->delete(); 
        return response()->json(['message' => 'Blog eliminado']);
    }
}