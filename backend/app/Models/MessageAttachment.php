<?php

namespace App\Models;
use App\Models\Message;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $fillable = [
        'message_id',
        'type',
        'mime_type',
        'url',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
