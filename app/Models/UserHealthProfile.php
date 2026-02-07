<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserHealthProfile extends Model
{
    /** @use HasFactory<\Database\Factories\UserHealthProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dob',
        'height_cm',
        'weight_kg_before',
        'weight_kg_current',
        'stage',
        'stage_start_date',
        'fetal_heart_rate',
        'systolic',
        'diastolic',
        'risk_level',
    ];

    protected $casts = [
        'dob' => 'date',
        'stage_start_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
