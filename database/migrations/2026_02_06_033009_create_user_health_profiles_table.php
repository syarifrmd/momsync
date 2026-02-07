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
        Schema::create('user_health_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('dob');
            $table->float('height_cm');
            $table->float('weight_kg_before');
            $table->float('weight_kg_current');
            $table->enum('stage', ['pregnancy', 'postpartum', 'nursing']);
            $table->date('stage_start_date');
            
            // Medical Metrics (Optional / Latest Checkup)
            $table->integer('fetal_heart_rate')->nullable();
            $table->integer('systolic')->nullable();
            $table->integer('diastolic')->nullable();
            
            // AI/System Inferred Risk
            $table->enum('risk_level', ['low', 'medium', 'high'])->default('low');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_health_profiles');
    }
};
