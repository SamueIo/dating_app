<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Swipe extends Model
{
    protected $fillable = [
        'user_id',
        'to_user_id',
        'direction'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}
