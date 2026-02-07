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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('thumbnail')->nullable();
            $table->string('category'); // e.g., 'nutrition', 'exercise', 'mental_health'
            
            // Personalization Rules
            $table->integer('min_week')->nullable(); // Applicable start week (pregnancy or baby age)
            $table->integer('max_week')->nullable();
            $table->json('risk_tags')->nullable(); // e.g., ['anemia', 'preeclampsia']
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
