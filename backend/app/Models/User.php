<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    public function photos()
    {
        return $this->hasMany(Photos::class);
    }

    public function swipesTo()
    {
        return $this->hasMany(Swipe::class);
    }
    public function filter()
    {
    return $this->hasOne(UserFilter::class);
    }
    public function swipeGiven()
    {
        return $this->hasMany(Swipe::class, 'user_id');
    }
    public function swipesReceived()
    {
    return $this->hasMany(Swipe::class, 'to_user_id');
    }
    public function matches()
    {
        return UserMatch::where(function ($query) {
            $query->where('user_one_id', $this->id)
                  ->orWhere('user_two_id', $this->id);
        })->get();
    }
    public function mainPhoto()
    {
    return $this->hasOne(Photos::class)->where('is_main', 1);
    }
    public function conversation()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
    public function blockedUsers()
    {
        return $this->hasMany(BlockedUser::class, 'blocker_id');
    }
    public function blockedByUsers()
    {
        return $this->hasMany(BlockedUser::class, 'blocked_id');
    }
    public function activity()
    {
        return $this->hasOne(UserActivity::class);
    }

}
