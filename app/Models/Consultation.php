<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'doctor_id',
        'schedule_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'schedule_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class); // The patient
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
