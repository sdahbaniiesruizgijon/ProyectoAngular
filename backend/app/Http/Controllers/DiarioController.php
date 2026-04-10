<?php

namespace App\Http\Controllers;

use App\Models\diarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class DiarioController extends Controller
{
    public function index() {
        // Cargamos la relación 'alimentos' para que el 'append' de totales funcione
        return diarios::with('alimentos')->where('user_id', auth()->id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'fecha' => 'required|date',
            'alimentos' => 'required|array' 
        ]);

        $diario = Auth::user()->diarios()->create([
            'titulo' => $request->titulo,
            'fecha' => $request->fecha,
            'descripcion' => $request->descripcion ?? 'Entrada de diario'
        ]);

        // Angular envía un objeto: { "ID": { "cantidad_gramos": X } }
        // Laravel's attach() acepta directamente ese formato de array asociativo
        if (!empty($request->alimentos)) {
            $diario->alimentos()->attach($request->alimentos);
        }

        return response()->json($diario->load('alimentos'), 201);
    }

    public function show($id)
    {
        return Auth::user()->diarios()->with('alimentos')->findOrFail($id);
    }

    public function update(Request $request, string $id)
{
    // 1. Validar la entrada
    $request->validate([
        'titulo'    => 'required|string|max:255',
        'fecha'     => 'required|date',
        'alimentos' => 'required|array', // El formato que enviamos desde Angular
    ]);

    // 2. Buscar el diario del usuario autenticado
    $diario = diarios::where('user_id', auth()->id())->findOrFail($id);

    // 3. Actualizar los campos básicos
    $diario->update([
        'titulo'      => $request->titulo,
        'fecha'       => $request->fecha,
        'descripcion' => $request->descripcion ?? 'Actualizado desde la agenda',
    ]);

    // 4. Sincronizar la tabla pivote (alimentos)
    // sync() elimina las relaciones viejas y pone las nuevas con sus cantidades
    $diario->alimentos()->sync($request->alimentos);

    return response()->json([
        'message' => '¡Agenda actualizada con éxito!',
        'data' => $diario->load('alimentos') 
    ], 200);
}

    public function destroy($id)
    {
        $diario = Auth::user()->diarios()->findOrFail($id);
        $diario->delete(); 
        return response()->json(['message' => 'Blog eliminado correctamente']);
    }
}