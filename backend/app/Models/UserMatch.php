<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UserMatch extends Model
{
    protected $table = 'matches';
    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'matched_at',
    ];

    public static function signMatchedToDb($userOneId, $userTwoId){
        $one = min($userOneId, $userTwoId);
        $two = max($userOneId, $userTwoId);

        $exists = self::where('user_one_id', $one)
            ->where('user_two_id', $two)
            ->exists();

        if(!$exists){
            return self::create([
                'user_one_id' => $userOneId,
                'user_two_id' => $userTwoId,
                'matched_at' => now(),
            ]);
        }
        return null;
    }
    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }
    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }
    public function getFormattedMatchedAtAttribute()
    {
        return Carbon::parse($this->updated_at)->format('j. n. Y H:i');
    }
}
