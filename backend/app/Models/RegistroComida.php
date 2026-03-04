<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistroComida extends Model
{
   protected $fillable = ['alimento', 'calorias', 'proteinas', 'fecha'];
}
