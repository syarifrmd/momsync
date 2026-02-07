<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ArticleSeeder::class,
        ]);
        
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Demo User',
            'email' => 'mom@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        $doctorUser = User::factory()->create([
            'name' => 'Dr. Sarah Sp.OG',
            'email' => 'doctor@example.com',
            'password' => bcrypt('password'),
            'role' => 'doctor',
        ]);

        \App\Models\Doctor::create([
            'user_id' => $doctorUser->id,
            'specialization' => 'Spesialis Kandungan',
            'str_number' => '1234567890',
            'hospital_name' => 'RS Bunda Jakarta',
            'is_online' => true,
        ]);
    }
}
