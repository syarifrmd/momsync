<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Article;
use App\Models\UserHealthProfile;
use App\Models\Doctor;
use App\Models\Consultation;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CareMomController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Redirect admin to admin dashboard
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'doctor') {
            $doctor = Doctor::where('user_id', $user->id)->first();
            $consultations = $doctor
                ? Consultation::with('user')
                    ->where('doctor_id', $doctor->id)
                    ->orderBy('schedule_date', 'desc')
                    ->take(10) // Limit to recent/upcoming
                    ->get()
                : [];

            return Inertia::render('doctor/dashboard', [
                'doctor' => $doctor,
                'consultations' => $consultations,
                'user' => $user,
            ]);
        }

        $profile = UserHealthProfile::where('user_id', $user->id)->first();

        $articles = [];
        $currentWeek = 0;
        $schedule = [];

        if ($profile) {
            $startDate = Carbon::parse($profile->stage_start_date);
            $currentWeek = (int) $startDate->diffInWeeks(now());
            
            // Generate schedule based on stage
            $schedule = $this->generateSchedule($profile, $startDate, $currentWeek);
            
            // Query for personalized articles
            $articles = Article::query()
                ->where('status', 'published') // Only published
                ->where(function($query) use ($profile, $currentWeek) {
                    $query->where('category', 'like', '%' . $profile->stage . '%') // Basic category match
                        ->orWhere(function($q) use ($currentWeek) {
                            $q->where('min_week', '<=', $currentWeek)
                            ->where('max_week', '>=', $currentWeek);
                        });
                })
                ->get();
        } else {
            // Fallback for new users without profile
            $articles = Article::where('status', 'published')->limit(5)->get();
        }

        return Inertia::render('care-mom', [
            'articles' => $articles,
            'userProfile' => $profile,
            'currentWeek' => $currentWeek,
            'schedule' => $schedule,
        ]);
    }

    private function generateSchedule($profile, $startDate, $currentWeek)
    {
        $schedule = [];

        if ($profile->stage === 'pregnancy') {
            // Jadwal ANC (Antenatal Care) sesuai standar Kemenkes RI
            // Minimal 6 kali kunjungan selama kehamilan
            $ancSchedule = [
                ['week' => 8, 'title' => 'Pemeriksaan ANC Pertama', 'desc' => 'Pemeriksaan lengkap, USG, dan tes laboratorium dasar'],
                ['week' => 12, 'title' => 'Kunjungan Trimester 1', 'desc' => 'Monitoring perkembangan janin dan kesehatan ibu'],
                ['week' => 20, 'title' => 'USG Anatomi', 'desc' => 'Pemeriksaan detail organ janin'],
                ['week' => 24, 'title' => 'Tes Gula Darah', 'desc' => 'Skrining diabetes gestasional'],
                ['week' => 28, 'title' => 'Kunjungan Trimester 2', 'desc' => 'Pemeriksaan tekanan darah dan berat badan'],
                ['week' => 32, 'title' => 'Monitoring Rutin', 'desc' => 'Pemeriksaan posisi bayi dan kesehatan ibu'],
                ['week' => 36, 'title' => 'Persiapan Persalinan', 'desc' => 'Diskusi rencana persalinan dan tanda-tanda lahir'],
                ['week' => 38, 'title' => 'Pemeriksaan Mendekati HPL', 'desc' => 'Monitoring intensif menjelang persalinan'],
                ['week' => 40, 'title' => 'Hari Perkiraan Lahir (HPL)', 'desc' => 'Evaluasi kondisi dan rencana induksi jika perlu'],
            ];

            foreach ($ancSchedule as $item) {
                $targetDate = $startDate->copy()->addWeeks($item['week']);
                $isPast = $targetDate->lt(now());
                $isUpcoming = !$isPast && $targetDate->lte(now()->addWeeks(2));

                $schedule[] = [
                    'week' => $item['week'],
                    'title' => $item['title'],
                    'description' => $item['desc'],
                    'date' => $targetDate->format('d M Y'),
                    'status' => $isPast ? 'past' : ($isUpcoming ? 'upcoming' : 'future'),
                    'type' => 'medical',
                ];
            }

            // Tambahkan jadwal vitamin dan suplemen
            if ($currentWeek >= 12) {
                $schedule[] = [
                    'week' => $currentWeek,
                    'title' => 'Minum Vitamin Kehamilan',
                    'description' => 'Asam folat, zat besi, dan kalsium setiap hari',
                    'date' => 'Setiap hari',
                    'status' => 'ongoing',
                    'type' => 'daily',
                ];
            }

        } elseif ($profile->stage === 'postpartum') {
            // Jadwal pemeriksaan nifas (0-40 hari)
            $days = (int) $startDate->diffInDays(now());
            
            $nifasSchedule = [
                ['day' => 1, 'title' => 'Pemeriksaan Post Partum 1', 'desc' => '24 jam pertama: Monitoring perdarahan dan kontraksi'],
                ['day' => 3, 'title' => 'Kunjungan Nifas 1', 'desc' => 'Hari ke-3: Perawatan luka jahitan dan payudara'],
                ['day' => 7, 'title' => 'Kunjungan Nifas 2', 'desc' => 'Minggu ke-1: Evaluasi involusi uterus'],
                ['day' => 14, 'title' => 'Kunjungan Nifas 3', 'desc' => 'Minggu ke-2: Konseling ASI dan KB'],
                ['day' => 40, 'title' => 'Kunjungan Nifas 4', 'desc' => 'Hari ke-40: Pemeriksaan akhir masa nifas'],
            ];

            foreach ($nifasSchedule as $item) {
                $targetDate = $startDate->copy()->addDays($item['day']);
                $isPast = $targetDate->lt(now());
                $isUpcoming = !$isPast && $targetDate->lte(now()->addDays(3));

                $schedule[] = [
                    'day' => $item['day'],
                    'title' => $item['title'],
                    'description' => $item['desc'],
                    'date' => $targetDate->format('d M Y'),
                    'status' => $isPast ? 'past' : ($isUpcoming ? 'upcoming' : 'future'),
                    'type' => 'medical',
                ];
            }

        } elseif ($profile->stage === 'nursing') {
            // Jadwal monitoring menyusui
            $months = (int) $startDate->diffInMonths(now());

            $schedule[] = [
                'title' => 'ASI Eksklusif',
                'description' => 'Berikan ASI eksklusif 0-6 bulan, lanjutkan hingga 2 tahun',
                'date' => 'Setiap hari',
                'status' => $months < 6 ? 'ongoing' : 'completed',
                'type' => 'daily',
            ];

            if ($months >= 6) {
                $schedule[] = [
                    'title' => 'Mulai MPASI',
                    'description' => 'Perkenalkan makanan pendamping ASI',
                    'date' => 'Bulan ke-6',
                    'status' => 'completed',
                    'type' => 'milestone',
                ];
            }
        }

        // Sort by date
        usort($schedule, function($a, $b) {
            if (isset($a['week']) && isset($b['week'])) {
                return $a['week'] <=> $b['week'];
            }
            if (isset($a['day']) && isset($b['day'])) {
                return $a['day'] <=> $b['day'];
            }
            return 0;
        });

        return $schedule;
    }

    public function showArticle(Article $article)
    {
        if ($article->status !== 'published') {
            abort(404);
        }

        $article->load('doctor'); // Assume relationship exists or will be ignored if not defined yet

        return Inertia::render('article/show', [
            'article' => $article
        ]);
    }

    public function reminders()
    {
        $user = Auth::user();
        $profile = UserHealthProfile::where('user_id', $user->id)->first();

        $schedule = [];
        $currentWeek = 0;

        if ($profile) {
            $startDate = Carbon::parse($profile->stage_start_date);
            $currentWeek = (int) $startDate->diffInWeeks(now());
            $schedule = $this->generateSchedule($profile, $startDate, $currentWeek);
        }

        return Inertia::render('reminders', [
            'schedule' => $schedule,
            'userProfile' => $profile,
            'currentWeek' => $currentWeek,
        ]);
    }
}
