<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Ensure only doctors access this via this controller (middleware should handle this too, but for safety)
        if ($user->role !== 'doctor') {
             abort(403);
        }

        $doctor = $user->doctor; // Relationship assumed from User model

        // Filter articles by the logged-in doctor
        $articles = Article::where('doctor_id', $doctor->id)
            ->latest()
            ->get();
            
        return Inertia::render('doctor/articles/index', [
            'articles' => $articles
        ]);
    }

    public function create()
    {
        return Inertia::render('doctor/articles/form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'min_week' => 'nullable|integer',
            'max_week' => 'nullable|integer',
            'status' => 'required|in:published,draft,archived',
        ]);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('articles', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        $validated['risk_tags'] = []; 
        $validated['doctor_id'] = Auth::user()->doctor->id;

        Article::create($validated);

        return redirect()->route('doctor.articles.index')->with('success', 'Artikel berhasil dibuat');
    }

    public function edit(Article $article)
    {
        // Ensure the doctor owns the article
        if ($article->doctor_id !== Auth::user()->doctor->id) {
            abort(403);
        }

        return Inertia::render('doctor/articles/form', [
            'article' => $article
        ]);
    }
    
    public function update(Request $request, Article $article)
    {
         // Ensure ownership
         if ($article->doctor_id !== Auth::user()->doctor->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'min_week' => 'nullable|integer',
            'max_week' => 'nullable|integer',
            'status' => 'required|in:published,draft,archived',
        ]);

        if ($request->hasFile('thumbnail')) {
             if ($article->thumbnail) {
                // Optional: Delete old image
                // Storage::disk('public')->delete(str_replace('/storage/', '', $article->thumbnail));
            }
            $path = $request->file('thumbnail')->store('articles', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        } else {
            unset($validated['thumbnail']);
        }

        $article->update($validated);

        return redirect()->route('doctor.articles.index')->with('success', 'Artikel berhasil diperbarui');
    }

    public function destroy(Article $article)
    {
        if ($article->doctor_id !== Auth::user()->doctor->id) {
            abort(403);
        }

        if ($article->thumbnail) {
            // Storage::disk('public')->delete(str_replace('/storage/', '', $article->thumbnail));
        }

        $article->delete();
        
        return redirect()->route('doctor.articles.index')->with('success', 'Artikel berhasil dihapus');
    }
}
