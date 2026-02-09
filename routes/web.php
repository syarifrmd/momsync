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
use App\Http\Controllers\ForumController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\CareLocatorController;
use App\Http\Controllers\AdminController;

// Test endpoint for debugging (no auth required)
Route::get('/locator/test', function() {
    \Log::info('Test endpoint called');
    $service = new \App\Services\HospitalApiService();
    $result = $service->getHospitals(['province_code' => '31', 'page' => 1, 'size' => 5]);
    \Log::info('Test endpoint result', ['result' => $result]);
    return response()->json($result);
})->name('locator.test');

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/care-mom', [CareMomController::class, 'index'])->name('care-mom');
    Route::get('/articles/{article}', [CareMomController::class, 'showArticle'])->name('articles.show');
    
    // Assistant
    Route::get('/assistant', [AssistantController::class, 'index'])->name('assistant');
    Route::post('/assistant/chat', [AssistantController::class, 'sendMessage'])->name('assistant.chat');

    // Consultation
    Route::get('/consultation', [ConsultationController::class, 'index'])->name('consultation');
    Route::post('/consultation/book', [ConsultationController::class, 'store'])->name('consultation.book');
    Route::get('/consultation/my', [ConsultationController::class, 'myConsultations'])->name('consultation.my');
    Route::patch('/consultation/{consultation}/status', [ConsultationController::class, 'updateStatus'])->name('consultation.status');
    
    // Forum
    Route::get('/forum', [ForumController::class, 'index'])->name('forum');
    Route::post('/forum/posts', [ForumController::class, 'store'])->name('forum.store');
    Route::get('/forum/posts/{id}', [ForumController::class, 'show'])->name('forum.show');
    Route::post('/forum/posts/{id}/like', [ForumController::class, 'toggleLike'])->name('forum.like');
    Route::post('/forum/posts/{id}/comment', [ForumController::class, 'addComment'])->name('forum.comment');
    Route::get('/forum/my-liked', [ForumController::class, 'myLikedPosts'])->name('forum.myliked');
    
    Route::get('/reminders', [CareMomController::class, 'reminders'])->name('reminders');
    
    // Care Locator / Hospital Finder
    Route::get('/locator', [CareLocatorController::class, 'index'])->name('locator');
    Route::get('/locator/search', [CareLocatorController::class, 'search'])->name('locator.search');
    Route::get('/locator/nearby', [CareLocatorController::class, 'nearby'])->name('locator.nearby');
    
    // Doctor Articles Management
    Route::prefix('doctor')->name('doctor.')->group(function () {
        Route::resource('articles', \App\Http\Controllers\ArticleController::class);
        Route::get('consultations', [\App\Http\Controllers\DoctorConsultationController::class, 'index'])->name('consultations.index');
        Route::patch('consultations/{consultation}', [\App\Http\Controllers\DoctorConsultationController::class, 'update'])->name('consultations.update');
    });

    // Admin Management
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::post('/users', [AdminController::class, 'createUser'])->name('users.create');
        Route::patch('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');
    });

    // Profile
    Route::get('/profile/setup', [HealthProfileController::class, 'create'])->name('profile.setup');
    Route::post('/profile/store', [HealthProfileController::class, 'store'])->name('profile.store');
    Route::post('/profile/update-physical', [HealthProfileController::class, 'updatePhysical'])->name('profile.update.physical');
    Route::post('/profile/update-condition', [HealthProfileController::class, 'updateCondition'])->name('profile.update.condition');
});
