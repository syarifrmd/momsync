<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = [
            [
                'name' => 'Dr. Sarah Wijaya, Sp.OG',
                'email' => 'sarah.wijaya@momsync.com',
                'specialization' => 'Obstetri dan Ginekologi',
                'hospital_name' => 'RS Hermina Pasteur',
                'whatsapp_number' => '6281234567890',
                'bio' => 'Dokter spesialis kandungan dengan pengalaman 15 tahun dalam menangani kehamilan dan persalinan.',
                'consultation_fee' => 150000,
            ],
            [
                'name' => 'Dr. Ahmad Rizki, Sp.A',
                'email' => 'ahmad.rizki@momsync.com',
                'specialization' => 'Anak',
                'hospital_name' => 'RS Hasan Sadikin',
                'whatsapp_number' => '6281234567891',
                'bio' => 'Spesialis anak yang berpengalaman dalam tumbuh kembang bayi dan anak.',
                'consultation_fee' => 120000,
            ],
            [
                'name' => 'Dr. Linda Kusuma, Sp.OG',
                'email' => 'linda.kusuma@momsync.com',
                'specialization' => 'Obstetri dan Ginekologi',
                'hospital_name' => 'RS Advent Bandung',
                'whatsapp_number' => '6281234567892',
                'bio' => 'Spesialis kandungan yang fokus pada kehamilan risiko tinggi dan USG 4D.',
                'consultation_fee' => 180000,
            ],
            [
                'name' => 'Dr. Budi Santoso, Sp.PD',
                'email' => 'budi.santoso@momsync.com',
                'specialization' => 'Penyakit Dalam',
                'hospital_name' => 'RS Borromeus',
                'whatsapp_number' => '6281234567893',
                'bio' => 'Dokter penyakit dalam yang menangani diabetes gestasional dan hipertensi pada ibu hamil.',
                'consultation_fee' => 140000,
            ],
            [
                'name' => 'Dr. Ratna Sari, Sp.GK',
                'email' => 'ratna.sari@momsync.com',
                'specialization' => 'Gizi Klinik',
                'hospital_name' => 'RS Santo Yusup',
                'whatsapp_number' => '6281234567894',
                'bio' => 'Spesialis gizi yang membantu perencanaan nutrisi untuk ibu hamil dan menyusui.',
                'consultation_fee' => 100000,
            ],
        ];

        foreach ($doctors as $doctorData) {
            $user = \App\Models\User::create([
                'name' => $doctorData['name'],
                'email' => $doctorData['email'],
                'password' => bcrypt('password'),
                'role' => 'doctor',
            ]);

            \App\Models\Doctor::create([
                'user_id' => $user->id,
                'specialization' => $doctorData['specialization'],
                'str_number' => 'STR' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT),
                'is_online' => true,
                'hospital_name' => $doctorData['hospital_name'],
                'whatsapp_number' => $doctorData['whatsapp_number'],
                'bio' => $doctorData['bio'],
                'photo' => null,
                'consultation_fee' => $doctorData['consultation_fee'],
            ]);
        }
    }
}
