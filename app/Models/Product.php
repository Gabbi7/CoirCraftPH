<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'image_url',
        'category',
        'stock',
        'featured_type',
        'is_active',
        'sold_count',
    ];
}
