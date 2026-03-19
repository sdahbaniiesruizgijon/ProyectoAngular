<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class diarios extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'titulo', 'fecha', 'descripcion'];

    
    protected $appends = ['totales']; 

    public function alimentos()
    {
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

        // Redondeamos
        foreach ($this->alimentos as $alimento) {
            $factor = $alimento->pivot->cantidad_gramos / 100;
            $totales['calorias'] += round($alimento->calorias * $factor, 2);
            $totales['proteinas'] += round($alimento->proteinas * $factor, 2);
            $totales['carbohidratos'] += round($alimento->carbohidratos * $factor, 2);
            $totales['grasas'] += round($alimento->grasas * $factor, 2);
        }

        return $totales;
    }
}