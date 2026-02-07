<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\StoreHealthProfileRequest;
use App\Models\UserHealthProfile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HealthProfileController extends Controller
{
    public function create()
    {
        return Inertia::render('health-profile/create');
    }

    public function store(StoreHealthProfileRequest $request)
    {
        $validated = $request->validated();
        
        // Basic Risk Calculation (Simple Rule-Based)
        // Fuzzy part will be refined later or via AI analysis
        $risk = 'low';
        
        // Calculate BMI
        $heightM = $validated['height_cm'] / 100;
        $bmi = $validated['weight_kg_current'] / ($heightM * $heightM);
        
        if ($bmi > 30 || $bmi < 18.5) {
            $risk = 'medium';
        }
        
        // Age Risk
        $age = \Carbon\Carbon::parse($validated['dob'])->age;
        if ($age < 18 || $age > 35) {
            $risk = $risk === 'medium' ? 'high' : 'medium';
        }

        // Prepare data
        $data = $validated;
        $data['risk_level'] = $risk;
        $data['user_id'] = Auth::id();
        
        // Special handling for stage_start_date if needed
        // If frontend sends 'last_period_date' for pregnancy, map it
        if ($request->has('last_period_date') && $validated['stage'] === 'pregnancy') {
            $data['stage_start_date'] = $validated['last_period_date'];
        } else if (!isset($data['stage_start_date'])) {
             // Fallback to today if not provided (should be handled by frontend)
             $data['stage_start_date'] = now();
        }

        UserHealthProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return redirect()->route('care-mom');
    }
}
