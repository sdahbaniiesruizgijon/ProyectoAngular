<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class diarios extends Model
{

    use HasFactory;

    protected $fillable = ['user_id', 'titulo', 'descripcion', 'fecha'];

    protected $appends = ['totales'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function alimentos()
    {
        return $this->belongsToMany(RegistroComida::class, 'diario_alimento', 'diario_id', 'registro_comida_id')
                    ->withPivot('cantidad_gramos')
                    ->withTimestamps();
    }

    // Lógica para calcular el total del "Blog"
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