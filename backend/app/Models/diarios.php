<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class diarios extends Model
{
    use HasFactory;

    // ESTO ES OBLIGATORIO para que el controlador pueda guardar
    protected $fillable = ['user_id', 'titulo', 'fecha', 'descripcion'];

    public function alimentos()
    {
        // Asegúrate de que los nombres de las tablas coincidan con lo que hicimos en SQL
        return $this->belongsToMany(RegistroComida::class, 'diario_alimento', 'diario_id', 'registro_comida_id')
                    ->withPivot('cantidad_gramos')
                    ->withTimestamps();
    }


    public function getTotalesAttribute()
    {
        $totales = [
            'calorias' => 0,
            'proteinas' => 0,
            'carbohidratos' => 0,
            'grasas' => 0
        ];

        foreach ($this->alimentos as $alimento) {
            $factor = $alimento->pivot->cantidad_gramos / 100;
            $totales['calorias'] += $alimento->calorias * $factor;
            $totales['proteinas'] += $alimento->proteinas * $factor;
            $totales['carbohidratos'] += $alimento->carbohidratos * $factor;
            $totales['grasas'] += $alimento->grasas * $factor;
        }

        return $totales;
    }

}