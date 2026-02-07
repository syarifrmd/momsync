<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Redirect dashboard to care-mom
Route::get('/dashboard', function () {
    return redirect()->route('care-mom');
})->middleware(['auth', 'verified'])->name('dashboard');

use App\Http\Controllers\AssistantController;
use App\Http\Controllers\CareMomController;
use App\Http\Controllers\HealthProfileController;

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/care-mom', [CareMomController::class, 'index'])->name('care-mom');
    
    // Assistant
    Route::get('/assistant', [AssistantController::class, 'index'])->name('assistant');
    Route::post('/assistant/chat', [AssistantController::class, 'sendMessage'])->name('assistant.chat');

    Route::get('/consultation', [App\Http\Controllers\TeleconsultationController::class, 'index'])->name('consultation');
    Route::post('/consultation', [App\Http\Controllers\TeleconsultationController::class, 'store'])->name('consultation.store');
    Route::get('/forum', fn() => Inertia::render('forum'))->name('forum');
    Route::get('/reminders', fn() => Inertia::render('reminders'))->name('reminders');
    Route::get('/locator', fn() => Inertia::render('care-locator'))->name('locator');
    
    // Doctor Articles Management
    Route::prefix('doctor')->name('doctor.')->group(function () {
        Route::resource('articles', \App\Http\Controllers\ArticleController::class);
        Route::get('consultations', [\App\Http\Controllers\DoctorConsultationController::class, 'index'])->name('consultations.index');
        Route::patch('consultations/{consultation}', [\App\Http\Controllers\DoctorConsultationController::class, 'update'])->name('consultations.update');
    });

    // Profile
    Route::get('/profile/setup', [HealthProfileController::class, 'create'])->name('profile.setup');
    Route::post('/profile/store', [HealthProfileController::class, 'store'])->name('profile.store');
});
