<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\diarios; 

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
        'fecha',
        'user_id'
    ];

    public function diarios()
    {
        return $this->belongsToMany(diarios::class, 'diario_alimento')
                    ->withPivot('cantidad_gramos')
                    ->withTimestamps();
    }
}