<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::latest()->get();
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
        ]);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('articles', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        // Default or empty for now
        $validated['risk_tags'] = []; 

        Article::create($validated);

        return redirect()->route('doctor.articles.index')->with('success', 'Artikel berhasil dibuat');
    }

    public function edit(Article $article)
    {
        return Inertia::render('doctor/articles/form', [
            'article' => $article
        ]);
    }

    public function update(Request $request, Article $article)
    {
        // When using Inertia with file uploads + PUT/PATCH, we often need to spoof method using _method if using FormData
        // Laravel handles this automatically if _method is sent, or we can use POST for updates with files.
        // Assuming the frontend sends POST with _method='PUT' if needed, OR we just route logic properly.
        // Standard inertia practice for files: use router.post with `_method: 'put'` or just forcePost and handle it.
        
        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'thumbnail' => 'nullable', // can be string (old url) or file
            'min_week' => 'nullable|integer',
            'max_week' => 'nullable|integer',
        ];

        // If thumbnail is a file, add image validation
        if ($request->hasFile('thumbnail')) {
             $rules['thumbnail'] = 'image|max:2048';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('articles', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        } else {
            // Keep existing thumbnail if string
            unset($validated['thumbnail']);
        }

        $article->update($validated);

        return redirect()->route('doctor.articles.index')->with('success', 'Artikel berhasil diperbarui');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->back()->with('success', 'Artikel berhasil dihapus');
    }
}
