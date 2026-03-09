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
    $diario = diarios::create([
        'user_id' => 1, // O auth()->id() si ya tienes login
        'titulo' => $request->titulo,
        'fecha' => $request->fecha,
        'descripcion' => $request->descripcion
    ]);

    // IMPORTANTE: El nombre 'alimentos' debe coincidir con el método del modelo
    if ($request->has('alimento_id')) {
        $diario->alimentos()->attach($request->alimento_id, [
            'cantidad_gramos' => $request->cantidad_gramos ?? 100
        ]);
    }

    return response()->json($diario, 201);
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