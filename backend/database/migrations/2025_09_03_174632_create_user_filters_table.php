<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

            $table->enum('gender', ['male', 'female'])->nullable();
            $table->unsignedTinyInteger('age_from')->nullable();
            $table->unsignedTinyInteger('age_to')->nullable();
            $table->string('location')->nullable();
            $table->unsignedSmallInteger('height_from')->nullable();
            $table->unsignedSmallInteger('height_to')->nullable();
            $table->boolean('only_online')->default(false);
            $table->boolean('with_photo')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_filters');
    }
};
