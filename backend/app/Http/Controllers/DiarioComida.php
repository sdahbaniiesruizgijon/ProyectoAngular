<?php

namespace App\Http\Controllers;


use App\Models\diarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiarioController extends Controller
{
    public function index()
    {
        return diarios::with('alimentos')->where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string',
            'fecha' => 'required|date',
            'alimentos' => 'required|array',
        ]);

        $diario = diarios::create([
            'user_id' => Auth::id() ?? 1, 
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
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