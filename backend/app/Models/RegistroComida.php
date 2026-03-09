<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroComida extends Model
{
    use HasFactory;

protected $table = 'registro_comidas';
    protected $fillable = [
        'alimento',
        'calorias',
        'proteinas',
        'carbohidratos',
        'grasas',
    ];

    public function diarios()
    {
        return $this->belongsToMany(diarios::class, 'diario_alimento')
                    ->withPivot('cantidad_gramos')
                    ->withTimestamps();
    }
}