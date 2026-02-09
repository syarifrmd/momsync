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
        $profile = UserHealthProfile::where('user_id', Auth::id())->first();
        
        return Inertia::render('health-profile/create', [
            'profile' => $profile ? [
                'dob' => $profile->dob?->format('Y-m-d'),
                'height_cm' => $profile->height_cm,
                'weight_kg_before' => $profile->weight_kg_before,
                'weight_kg_current' => $profile->weight_kg_current,
                'stage' => $profile->stage,
                'stage_start_date' => $profile->stage_start_date?->format('Y-m-d'),
                'systolic' => $profile->systolic,
                'diastolic' => $profile->diastolic,
                'risk_level' => $profile->risk_level,
            ] : null,
        ]);
    }

    public function store(StoreHealthProfileRequest $request)
    {
        $validated = $request->validated();
        
        // Basic Risk Calculation (Simple Rule-Based)
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
        $data = [
            'user_id' => Auth::id(),
            'dob' => $validated['dob'],
            'height_cm' => $validated['height_cm'],
            'weight_kg_before' => $validated['weight_kg_before'],
            'weight_kg_current' => $validated['weight_kg_current'],
            'stage' => $validated['stage'],
            'risk_level' => $risk,
        ];
        
        // Handle stage_start_date properly
        if ($validated['stage'] === 'pregnancy' && isset($validated['last_period_date'])) {
            $data['stage_start_date'] = $validated['last_period_date'];
        } elseif (isset($validated['stage_start_date'])) {
            $data['stage_start_date'] = $validated['stage_start_date'];
        } else {
            // Fallback to today if not provided
            $data['stage_start_date'] = now();
        }

        // Add optional medical metrics if provided
        if (isset($validated['systolic']) && !empty($validated['systolic'])) {
            $data['systolic'] = $validated['systolic'];
        }
        if (isset($validated['diastolic']) && !empty($validated['diastolic'])) {
            $data['diastolic'] = $validated['diastolic'];
        }
        if (isset($validated['fetal_heart_rate']) && !empty($validated['fetal_heart_rate'])) {
            $data['fetal_heart_rate'] = $validated['fetal_heart_rate'];
        }

        UserHealthProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return redirect()->route('care-mom')->with('success', 'Profil kesehatan berhasil disimpan!');
    }

    public function updatePhysical(Request $request)
    {
        $validated = $request->validate([
            'dob' => 'required|date|before:today',
            'height_cm' => 'required|numeric|min:100|max:250',
            'weight_kg_before' => 'required|numeric|min:30|max:200',
            'weight_kg_current' => 'required|numeric|min:30|max:200',
        ]);

        $profile = UserHealthProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return back()->with('success', 'Data fisik berhasil disimpan!');
    }

    public function updateCondition(Request $request)
    {
        $validated = $request->validate([
            'stage' => 'required|in:pregnancy,postpartum,nursing',
            'stage_start_date' => 'required|date',
            'systolic' => 'nullable|numeric|min:60|max:200',
            'diastolic' => 'nullable|numeric|min:40|max:150',
        ]);

        $data = $validated;
        
        // Calculate risk if we have existing profile data
        $profile = UserHealthProfile::where('user_id', Auth::id())->first();
        if ($profile && $profile->height_cm && $profile->weight_kg_current) {
            $heightM = $profile->height_cm / 100;
            $bmi = $profile->weight_kg_current / ($heightM * $heightM);
            
            $risk = 'low';
            if ($bmi > 30 || $bmi < 18.5) {
                $risk = 'medium';
            }
            
            if ($profile->dob) {
                $age = \Carbon\Carbon::parse($profile->dob)->age;
                if ($age < 18 || $age > 35) {
                    $risk = $risk === 'medium' ? 'high' : 'medium';
                }
            }
            
            $data['risk_level'] = $risk;
        }

        UserHealthProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return back()->with('success', 'Data kondisi berhasil disimpan!');
    }
}
