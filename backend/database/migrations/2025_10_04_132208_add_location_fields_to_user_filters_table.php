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
        Schema::table('user_filters', function (Blueprint $table) {
            $table->double('latitude')->nullable()->after('location');
            $table->double('longitude')->nullable()->after('latitude');
            $table->integer('radius_km')->default(10)->after('longitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_filters', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'radius_km']);
        });
    }
};
