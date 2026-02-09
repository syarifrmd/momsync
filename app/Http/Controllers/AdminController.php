<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Article;
use App\Models\Consultation;
use App\Models\Doctor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        // Get statistics
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_doctors' => User::where('role', 'doctor')->count(),
            'total_articles' => Article::count(),
            'total_consultations' => Consultation::count(),
            'recent_consultations' => Consultation::with(['user', 'doctor.user'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
            'recent_users' => User::orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function users()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $users = User::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['user', 'doctor', 'admin'])],
        ]);

        $user->update($validated);

        // If role changed to doctor, create doctor profile if not exists
        if ($validated['role'] === 'doctor' && !$user->doctor) {
            Doctor::create([
                'user_id' => $user->id,
                'specialization' => 'Dokter Umum',
                'hospital_name' => 'MomSync Hospital',
            ]);
        }

        return back()->with('success', 'User updated successfully');
    }

    public function deleteUser(User $user)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        // Prevent deleting own account
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Cannot delete your own account');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully');
    }

    public function createUser(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['user', 'doctor', 'admin'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // If doctor role, create doctor profile
        if ($validated['role'] === 'doctor') {
            Doctor::create([
                'user_id' => $user->id,
                'specialization' => 'Dokter Umum',
                'hospital_name' => 'MomSync Hospital',
            ]);
        }

        return back()->with('success', 'User created successfully');
    }
}
