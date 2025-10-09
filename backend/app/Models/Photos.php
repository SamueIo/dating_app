<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photos extends Model
{
    protected $fillable = ['user_id', 'file_name', 'description', 'is_main'];
    protected $table = 'photos';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
