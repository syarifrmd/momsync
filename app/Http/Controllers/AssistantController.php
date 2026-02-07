<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\UserHealthProfile;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssistantController extends Controller
{
    protected $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    public function index()
    {
        // Load latest session or create empty state
        $session = ChatSession::where('user_id', Auth::id())
            ->with(['messages' => function($q) {
                $q->latest()->take(20); // Load last 20 messages inverted
            }])
            ->latest()
            ->first();

        $messages = $session ? $session->messages->reverse()->values() : [];

        return Inertia::render('assistant', [
            'initialMessages' => $messages,
            'sessionId' => $session?->id
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'session_id' => 'nullable|exists:chat_sessions,id'
        ]);

        $user = Auth::user();
        $messageText = $request->input('message');
        
        // 1. Get or Create Session
        $sessionId = $request->input('session_id');
        if (!$sessionId) {
            $session = ChatSession::create([
                'user_id' => $user->id,
                'title' => 'Consultation ' . now()->format('d M H:i'),
            ]);
            $sessionId = $session->id;
        }

        // 2. Save User Message
        ChatMessage::create([
            'session_id' => $sessionId,
            'sender' => 'user',
            'message' => $messageText,
        ]);

        // 3. Prepare Context (Profile)
        $profile = UserHealthProfile::where('user_id', $user->id)->first();
        $context = $profile ? $profile->toArray() : [];

        // 4. Call Gemini AI
        $response = $this->gemini->generateResponse($messageText, $context);

        // 5. Save AI Response
        $aiMsg = ChatMessage::create([
            'session_id' => $sessionId,
            'sender' => 'ai',
            'message' => $response,
        ]);

        return response()->json([
            'response' => $response,
            'session_id' => $sessionId,
            'message_id' => $aiMsg->id
        ]);
    }
}
