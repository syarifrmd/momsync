<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'thumbnail',
        'category',
        'min_week',
        'max_week',
        'risk_tags',
    ];

    protected $casts = [
        'risk_tags' => 'array',
    ];
}
