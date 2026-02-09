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
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('whatsapp_number')->nullable()->after('hospital_name');
            $table->text('bio')->nullable()->after('whatsapp_number');
            $table->string('photo')->nullable()->after('bio');
            $table->decimal('consultation_fee', 10, 2)->default(0)->after('photo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_number', 'bio', 'photo', 'consultation_fee']);
        });
    }
};
