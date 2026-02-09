<?php

namespace App\Http\Controllers;

use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Models\ForumLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ForumController extends Controller
{
    public function index()
    {
        $posts = ForumPost::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'category' => $post->category,
                    'author' => $post->user->name,
                    'authorInitial' => strtoupper(substr($post->user->name, 0, 2)),
                    'timestamp' => $post->created_at,
                    'likes' => $post->likes_count,
                    'comments' => $post->comments_count,
                    'liked' => $post->isLikedBy(Auth::id()),
                    'commentsList' => $post->comments->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'author' => $comment->user->name,
                            'authorInitial' => strtoupper(substr($comment->user->name, 0, 2)),
                            'timestamp' => $comment->created_at,
                        ];
                    }),
                ];
            });

        return Inertia::render('forum', [
            'initialPosts' => $posts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
        ]);

        $post = ForumPost::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'],
        ]);

        $post->load('user');

        return response()->json([
            'success' => true,
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'category' => $post->category,
                'author' => $post->user->name,
                'authorInitial' => strtoupper(substr($post->user->name, 0, 2)),
                'timestamp' => $post->created_at,
                'likes' => 0,
                'comments' => 0,
                'liked' => false,
                'commentsList' => [],
            ],
        ]);
    }

    public function show($id)
    {
        $post = ForumPost::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->findOrFail($id);

        return response()->json([
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'category' => $post->category,
            'author' => $post->user->name,
            'authorInitial' => strtoupper(substr($post->user->name, 0, 2)),
            'timestamp' => $post->created_at,
            'likes' => $post->likes_count,
            'comments' => $post->comments_count,
            'liked' => $post->isLikedBy(Auth::id()),
            'commentsList' => $post->comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'author' => $comment->user->name,
                    'authorInitial' => strtoupper(substr($comment->user->name, 0, 2)),
                    'timestamp' => $comment->created_at,
                ];
            }),
        ]);
    }

    public function toggleLike($id)
    {
        $post = ForumPost::findOrFail($id);
        $userId = Auth::id();

        $like = ForumLike::where('forum_post_id', $id)
            ->where('user_id', $userId)
            ->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            $liked = false;
        } else {
            ForumLike::create([
                'forum_post_id' => $id,
                'user_id' => $userId,
            ]);
            $post->increment('likes_count');
            $liked = true;
        }

        return response()->json([
            'success' => true,
            'liked' => $liked,
            'likes_count' => $post->fresh()->likes_count,
        ]);
    }

    public function addComment(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $post = ForumPost::findOrFail($id);

        $comment = ForumComment::create([
            'forum_post_id' => $id,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $post->increment('comments_count');

        $comment->load('user');

        return response()->json([
            'success' => true,
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'author' => $comment->user->name,
                'authorInitial' => strtoupper(substr($comment->user->name, 0, 2)),
                'timestamp' => $comment->created_at,
            ],
            'comments_count' => $post->fresh()->comments_count,
        ]);
    }

    public function myLikedPosts()
    {
        $likedPosts = ForumPost::whereHas('likes', function ($query) {
            $query->where('user_id', Auth::id());
        })
        ->with(['user'])
        ->withCount(['likes', 'comments'])
        ->latest()
        ->get()
        ->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'category' => $post->category,
                'author' => $post->user->name,
                'timestamp' => $post->created_at,
                'likes' => $post->likes_count,
                'comments' => $post->comments_count,
            ];
        });

        return response()->json($likedPosts);
    }
}
