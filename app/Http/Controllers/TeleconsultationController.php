<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeleconsultationController extends Controller
{
    public function index()
    {
        $doctors = Doctor::with('user')->get()->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'name' => $doctor->user->name,
                'specialty' => $doctor->specialization,
                'rating' => 5.0, // placeholder
                'experience' => 5, // placeholder
                'hospital' => $doctor->hospital_name,
                'available' => $doctor->is_online,
                'price' => 'Rp 150.000', // placeholder
                // 'image' => $doctor->user->profile_photo_url, // if utilizing jetstream/fortify features
            ];
        });

        return Inertia::render('teleconsultation', [
            'doctors' => $doctors
        ]);
    }

    public function store(Request $request)
    {
         // Logic to store consultation request
         $request->validate([
             'doctor_id' => 'required|exists:doctors,id',
         ]);

         $consultation = \App\Models\Consultation::create([
             'user_id' => auth()->id(),
             'doctor_id' => $request->doctor_id,
             'schedule_date' => now(), // Meaning "Now" or "ASAP"
             'status' => 'pending',
         ]);

         // Trigger WA redirect on frontend? 
         // Or return the WA link.
         // "https://wa.me/628123456789?text=Halo%20Dokter%20saya%20ingin%20konsultasi..."

         return redirect()->back()->with('success', 'Permintaan konsultasi berhasil dibuat.');
    }
}
