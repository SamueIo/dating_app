<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('interested_in')->nullable();
            $table->string('relationship_type')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->integer('height')->nullable();
            $table->string('education')->nullable();
            $table->string('job_title')->nullable();
            $table->enum('smoking',['yes','no','neutral','hate'])->nullable();
            $table->enum('drinking',['yes','no','neutral','hate'])->nullable();
            $table->string('pets')->nullable();
            $table->boolean('verified')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
