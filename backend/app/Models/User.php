<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Atributos que deben ocultarse en las respuestas JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Relación Uno a Muchos con el modelo Diario.
     * Un usuario puede tener múltiples entradas en su diario.
     */
    public function diarios()
    {
        // Al estar en el mismo namespace (App\Models), no hace falta el 'use' arriba
        return $this->hasMany(diarios::class, 'user_id');
    }

    /**
     * Relación Uno a Muchos con el modelo RegistroComida.
     * Un usuario puede registrar múltiples alimentos de forma individual.
     */
    public function comidas()
    {
        return $this->hasMany(RegistroComida::class, 'user_id');
    }

    /**
     * Casting de atributos (opcional, pero recomendado para seguridad).
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}