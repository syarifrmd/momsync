<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHealthProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'dob' => 'required|date',
            'height_cm' => 'required|numeric|min:100|max:250',
            'weight_kg_before' => 'required|numeric|min:30|max:300',
            'weight_kg_current' => 'required|numeric|min:30|max:300',
            'stage' => 'required|in:pregnancy,postpartum,nursing',
            'last_period_date' => 'required_if:stage,pregnancy|date|nullable', 
            // We use 'last_period_date' from frontend to calculate 'stage_start_date' for pregnancy
            // For other stages, frontend might send 'birth_date' mapped to stage_start_date
            'stage_start_date' => 'nullable|date',
        ];
    }
}
