<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('swipes', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')->constrained()->onDelete('cascade');

        $table->foreignId('to_user_id')->constrained('users')->onDelete('cascade');
        $table->enum('direction', ['like', 'dislike'])->default('like');

        $table->timestamps();

        $table->unique(['user_id', 'to_user_id']);
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
