<?php

namespace App\Http\Controllers;

use App\Models\RegistroComida;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistroComidaController extends Controller
{
    /**
     * Muestra solo las comidas del usuario que ha iniciado sesión.
     */
    public function index()
    {
        // Importante: No uses RegistroComida::all(), 
        // porque eso mostraría los datos de todo el mundo.
        return Auth::user()->comidas; 
    }

    /**
     * Guarda una nueva comida asociada al usuario.
     */
    public function store(Request $request)
    {
        // 1. Validamos los datos (Esto es clave para el RA 2 de DIW)
        $validated = $request->validate([
            'alimento'      => 'required|string|max:255',
            'calorias'      => 'required|numeric',
            'proteinas'     => 'nullable|numeric',
            'carbohidratos' => 'nullable|numeric',
            'grasas'        => 'nullable|numeric',
            'fecha'         => 'required|date',
        ]);

        // 2. Creamos el registro a través de la relación del usuario
        // Laravel inyectará automáticamente el 'user_id' correcto.
        return $request->user()->comidas()->create($validated);
    }

    /**
     * Muestra una comida específica (siempre que pertenezca al usuario).
     */
    public function show($id)
    {
        return Auth::user()->comidas()->findOrFail($id);
    }

    /**
     * Actualiza una comida existente.
     */
    public function update(Request $request, $id)
    {
        $comida = Auth::user()->comidas()->findOrFail($id);
        $comida->update($request->all());
        return $comida;
    }

    /**
     * Elimina una comida.
     */
    public function destroy($id)
    {
        $comida = Auth::user()->comidas()->findOrFail($id);
        $comida->delete();

        return response()->json(['message' => 'Registro eliminado con éxito']);
    }
}