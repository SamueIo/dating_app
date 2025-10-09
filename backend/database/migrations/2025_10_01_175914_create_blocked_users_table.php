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
        Schema::create('blocked_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blocker_id')->constrained('users')->onDelete('cascade'); // ten kto blokuje
            $table->foreignId('blocked_id')->constrained('users')->onDelete('cascade'); // ten kto je blokovaný
            $table->timestamps();

            $table->unique(['blocker_id', 'blocked_id']); // zabráni duplikátom
        });
    }

    public function down()
    {
        Schema::dropIfExists('blocked_users');
    }
};
