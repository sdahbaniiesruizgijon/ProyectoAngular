<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Importamos los modelos que usa este archivo
use App\Models\RegistroComida;
use App\Models\diarios; 

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relación con diarios
    public function diarios()
    {
        // Asegúrate de que el modelo se llame 'diarios' o cámbialo a 'Diario'
        return $this->hasMany(diarios::class, 'user_id');
    }

    // Relación con comidas
    public function comidas()
    {
        return $this->hasMany(RegistroComida::class, 'user_id');
    }
}