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

    public function store(Request $request)
    {
        $comida = RegistroComida::create($request->all());
        return response()->json($comida, 201);
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