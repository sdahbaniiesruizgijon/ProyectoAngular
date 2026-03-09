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
    $request->validate([
        'titulo' => 'required|string',
        'fecha' => 'required|date',
        'alimentos' => 'required|array',
    ]);

    $diario = \App\Models\diarios::create([
        'user_id' => 1, 
        'titulo' => $request->titulo,
        'descripcion' => $request->descripcion ?? '', 
        'fecha' => $request->fecha,
    ]);

    foreach ($request->alimentos as $item) {
        $diario->alimentos()->attach($item['id'], [
            'cantidad_gramos' => $item['cantidad']
        ]);
    }

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