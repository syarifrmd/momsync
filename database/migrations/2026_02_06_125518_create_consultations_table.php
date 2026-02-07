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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Patient
            $table->foreignId('doctor_id')->nullable()->constrained('doctors')->onDelete('cascade'); // Doctor (nullable if we want to support picking later? No, usually picked first)
            // Or if doctors are just users with role, we might use foreignId('doctor_id')->constrained('users')
            // But since 'doctors' table exists, use it.
            $table->dateTime('schedule_date')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, completed, cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
