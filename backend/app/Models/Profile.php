<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
     protected $fillable = [
        'user_id',
        'birth_date',
        'gender',
        'interested_in',
        'relationship_type',
        'bio',
        'location',
        'height',
        'education',
        'job_title',
        'smoking',
        'drinking',
        'pets',
        'verified',
        'latitude',
        'longitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
