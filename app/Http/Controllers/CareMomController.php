<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Article;
use App\Models\UserHealthProfile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CareMomController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $profile = UserHealthProfile::where('user_id', $user->id)->first();

        $articles = [];
        $currentWeek = 0;

        if ($profile) {
            $startDate = Carbon::parse($profile->stage_start_date);
            $currentWeek = (int) $startDate->diffInWeeks(now());
            
            // Query for personalized articles
            $articles = Article::query()
                ->where('category', 'like', '%' . $profile->stage . '%') // Basic category match
                ->orWhere(function($query) use ($currentWeek) {
                    $query->where('min_week', '<=', $currentWeek)
                          ->where('max_week', '>=', $currentWeek);
                })
                ->get();
        } else {
            // Fallback for new users without profile
            $articles = Article::limit(5)->get();
        }

        return Inertia::render('care-mom', [
            'articles' => $articles,
            'userProfile' => $profile,
            'currentWeek' => $currentWeek
        ]);
    }
}
