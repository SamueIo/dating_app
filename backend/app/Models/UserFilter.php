<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFilter extends Model
{
    protected $fillable = [
        'user_id',
        'gender',
        'age_from',
        'age_to',
        'location',
        'height_from',
        'height_to',
        'only_online',
        'with_photo',
        'latitude',
        'longitude',
        'radius_km',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
