<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // <--- IMPORTANTE: Asegúrate de tener esto
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // <--- Añade HasApiTokens aquí

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Tu relación con diarios que ya tenías:
    public function diarios()
    {
        return $this->hasMany(diarios::class, 'user_id');
    }
}