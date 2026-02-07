<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorConsultationController extends Controller
{
    public function index()
    {
        // Assuming the logged in user is a doctor or linked to a doctor
        // We should really check auth()->user()->doctor link
        $doctor = \App\Models\Doctor::where('user_id', auth()->id())->first();
        
        if (!$doctor) {
            abort(403, 'Akses ditolak. Anda bukan dokter.');
        }

        $consultations = Consultation::with('user')
            ->where('doctor_id', $doctor->id)
            ->latest()
            ->get();

        return Inertia::render('doctor/consultations/index', [
            'consultations' => $consultations
        ]);
    }

    public function update(Request $request, Consultation $consultation)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string'
        ]);

        $consultation->update($request->only('status', 'notes'));

        return redirect()->back()->with('success', 'Status konsultasi diperbarui.');
    }
}
