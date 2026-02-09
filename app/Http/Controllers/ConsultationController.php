<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    // List all available doctors
    public function index()
    {
        $doctors = Doctor::with('user')
            ->where('is_online', true)
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->user->name,
                    'specialization' => $doctor->specialization,
                    'hospital_name' => $doctor->hospital_name,
                    'bio' => $doctor->bio,
                    'photo' => $doctor->photo,
                    'consultation_fee' => $doctor->consultation_fee,
                    'is_online' => $doctor->is_online,
                ];
            });

        return Inertia::render('teleconsultation', [
            'doctors' => $doctors,
        ]);
    }

    // Book a consultation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'schedule_date' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        $consultation = Consultation::create([
            'user_id' => Auth::id(),
            'doctor_id' => $validated['doctor_id'],
            'schedule_date' => $validated['schedule_date'],
            'notes' => $validated['notes'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Konsultasi berhasil dibuat! Tunggu konfirmasi dari dokter.');
    }

    // Get user's consultations
    public function myConsultations()
    {
        $consultations = Consultation::with(['doctor.user'])
            ->where('user_id', Auth::id())
            ->orderBy('schedule_date', 'desc')
            ->get()
            ->map(function ($consultation) {
                return [
                    'id' => $consultation->id,
                    'doctor_name' => $consultation->doctor->user->name,
                    'doctor_specialization' => $consultation->doctor->specialization,
                    'doctor_whatsapp' => $consultation->doctor->whatsapp_number,
                    'schedule_date' => $consultation->schedule_date,
                    'status' => $consultation->status,
                    'notes' => $consultation->notes,
                    'whatsapp_link' => $consultation->status === 'confirmed' && $consultation->doctor->whatsapp_number
                        ? 'https://wa.me/' . preg_replace('/[^0-9]/', '', $consultation->doctor->whatsapp_number)
                        : null,
                ];
            });

        return response()->json($consultations);
    }

    // Update consultation status (for doctors - can be used for admin panel later)
    public function updateStatus(Request $request, Consultation $consultation)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $consultation->update(['status' => $validated['status']]);

        return back()->with('success', 'Status konsultasi berhasil diupdate!');
    }
}
