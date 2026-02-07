<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }

    public function generateResponse(string $userMessage, array $context = [])
    {
        if (empty($this->apiKey)) {
            return "Error: Gemini API Key is missing in configuration.";
        }

        $systemPrompt = $this->buildSystemPrompt($context);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}?key={$this->apiKey}", [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $systemPrompt . "\n\nUser Question: " . $userMessage]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 500,
            ]
        ]);

        if ($response->failed()) {
            Log::error('Gemini API Error', ['body' => $response->body()]);
            return "Maaf, saya sedang mengalami gangguan. Silakan coba lagi nanti.";
        }

        $data = $response->json();
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? "Maaf, saya tidak mengerti.";
    }

    protected function buildSystemPrompt(array $context): string
    {
        $profileText = "No profile data available.";
        
        if (!empty($context)) {
            $age = \Carbon\Carbon::parse($context['dob'])->age;
            $stage = ucfirst($context['stage']);
            $risk = strtoupper($context['risk_level']);
            
            $profileText = "
            User Profile:
            - Age: {$age}
            - Stage: {$stage}
            - Current Weight: {$context['weight_kg_current']} kg
            - Risk Level (System Calc): {$risk}
            ";
        }

        return "
        Role: You are 'MomSync', a specialized maternal health assistant (Midwife/Obstetrician persona).
        
        {$profileText}

        Instructions:
        1. Answer strictly based on medical guidelines (WHO/Ministry of Health Indonesia).
        2. Be empathetic but professional.
        3. Use the supplied User Profile to personalize advice.
        4. If Risk Level is HIGH, strictly advise visiting a hospital.
        5. Output Format: Plain text, short paragraphs.
        ";
    }
}
