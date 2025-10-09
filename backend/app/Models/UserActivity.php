<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    protected $fillable = [
        'user_id',
        'last_active_at',
        'is_active',
    ];

    protected $casts = [
        'last_active_at' => 'datetime',
        'is_active' => 'boolean', // odporúčam aj toto
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
