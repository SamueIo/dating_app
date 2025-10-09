<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class, 'conversation_user', 'conversation_id', 'user_id');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

    public function getOtherUserAttribute()
    {
        return $this->users->firstWhere('id', '!=', auth()->id());
    }


}
