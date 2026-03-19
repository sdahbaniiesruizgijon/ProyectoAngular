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
    return \App\Models\diarios::with('alimentos')->where('user_id', Auth::id())->get();
}

public function store(Request $request)
{
    // Creamos el diario
    $diario = diarios::create([
        'user_id' => Auth::id(),
        'titulo' => $request->titulo,
        'fecha' => $request->fecha,
        'descripcion' => $request->descripcion ?? 'Entrada de diario'
    ]);

    if ($request->has('alimentos') && is_array($request->alimentos)) {
        
        $formateados = [];
        foreach ($request->alimentos as $item) {
            $formateados[$item['id']] = ['cantidad_gramos' => $item['cantidad']];
        }

        $diario->alimentos()->attach($formateados);
    }

    return response()->json($diario->load('alimentos'), 201);
}
    public function show($id)
    {
        return diarios::with('alimentos')->findOrFail($id);
    }

    public function destroy($id)
    {
        $diario = diarios::findOrFail($id);
        $diario->delete(); 
        return response()->json(['message' => 'Blog eliminado']);
    }
}