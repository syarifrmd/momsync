<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Article;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Nutrisi Penting di Trimester 1',
                'category' => 'pregnancy',
                'min_week' => 0,
                'max_week' => 12,
                'content' => 'Asam folat sangat penting di awal kehamilan...',
                'thumbnail' => 'https://images.unsplash.com/photo-1667821350151-cb3acb6b9101?auto=format&fit=crop&q=80&w=1080',
                'risk_tags' => ['nutrition', 'general'],
            ],
            [
                'title' => 'Mengatasi Morning Sickness',
                'category' => 'pregnancy',
                'min_week' => 4,
                'max_week' => 16,
                'content' => 'Tips ampuh mengurangi mual muntah...',
                'thumbnail' => 'https://images.unsplash.com/photo-1544367563-12123d832d61?auto=format&fit=crop&q=80&w=1080',
                'risk_tags' => ['nausea'],
            ],
            [
                'title' => 'Persiapan Persalinan: Tas Rumah Sakit',
                'category' => 'pregnancy',
                'min_week' => 36,
                'max_week' => 40,
                'content' => 'Checklist barang yang wajib dibawa...',
                'thumbnail' => 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1080',
                'risk_tags' => ['labor'],
            ],
            [
                'title' => 'Cara Menyusui yang Benar (Pelekatan)',
                'category' => 'nursing',
                'min_week' => 0, // baby age in weeks
                'max_week' => 24,
                'content' => 'Posisi pelekatan yang baik mencegah lecet...',
                'thumbnail' => 'https://images.unsplash.com/photo-1617336056320-911a7a0b8656?auto=format&fit=crop&q=80&w=1080',
                'risk_tags' => ['breastfeeding'],
            ],
            [
                'title' => 'Perawatan Luka Jahitan Pasca Melahirkan',
                'category' => 'postpartum',
                'min_week' => 0,
                'max_week' => 6,
                'content' => 'Jaga kebersihan area luka untuk mencegah infeksi...',
                'thumbnail' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1080',
                'risk_tags' => ['recovery', 'hygiene'],
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
