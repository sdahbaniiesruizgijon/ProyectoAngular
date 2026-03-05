<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroComida extends Model
{
    use HasFactory;

    protected $table = 'comidas'; 

    protected $fillable = [
        'alimento',
        'calorias',
        'proteinas',
        'carbohidratos',
        'grasas',
        'fecha',
    ];
}