<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $products = [
            // Gardening
            [
                'name' => 'Coco Peat',
                'description' => 'Premium compressed coco peat. High water retention, perfect for soil conditioning.',
                'price' => 120,
                'image_url' => 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&q=80',
                'category' => 'Gardening',
                'stock' => 150,
                'featured_type' => 'Best Seller',
                'is_active' => true,
                'sold_count' => 540
            ],
            [
                'name' => 'Grow Bags',
                'description' => 'Eco-friendly coir grow bags. Durable and breathable for healthy root growth.',
                'price' => 250,
                'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
                'category' => 'Gardening',
                'stock' => 85,
                'featured_type' => 'Trending',
                'is_active' => true,
                'sold_count' => 124
            ],
            [
                'name' => 'Coir Pots',
                'description' => 'Natural coco fiber pots. Transplant directly into the ground without root shock.',
                'price' => 180,
                'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
                'category' => 'Gardening',
                'stock' => 200,
                'featured_type' => 'New',
                'is_active' => true,
                'sold_count' => 89
            ],

            // Home Products
            [
                'name' => 'Doormats',
                'description' => 'Sturdy, handwoven coir doormat. Natural scraping action keeps your home clean.',
                'price' => 350,
                'image_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
                'category' => 'Home Products',
                'stock' => 60,
                'featured_type' => 'Best Seller',
                'is_active' => true,
                'sold_count' => 312
            ],
            [
                'name' => 'Brushes',
                'description' => 'Sustainable scrubbing brushes made from stiff coconut fibers. Ideal for heavy-duty cleaning.',
                'price' => 85,
                'image_url' => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80',
                'category' => 'Home Products',
                'stock' => 150,
                'featured_type' => 'Trending',
                'is_active' => true,
                'sold_count' => 245
            ],

            // Agriculture
            [
                'name' => 'Coir Logs',
                'description' => 'Heavy-duty coir logs for bank stabilization and erosion management.',
                'price' => 1200,
                'image_url' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80',
                'category' => 'Agriculture',
                'stock' => 25,
                'featured_type' => 'None',
                'is_active' => true,
                'sold_count' => 45
            ],
            [
                'name' => 'Coir Mats',
                'description' => 'Large-scale coir weed mats for moisture retention in agricultural fields.',
                'price' => 850,
                'image_url' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80',
                'category' => 'Agriculture',
                'stock' => 40,
                'featured_type' => 'New',
                'is_active' => true,
                'sold_count' => 32
            ],

            // Raw Materials
            [
                'name' => 'Coir Fiber',
                'description' => 'Loose coconut coir fiber for industrial use and horticultural mulch.',
                'price' => 320,
                'image_url' => 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80',
                'category' => 'Raw Materials',
                'stock' => 100,
                'featured_type' => 'None',
                'is_active' => true,
                'sold_count' => 156
            ],
            [
                'name' => 'Coir Rope',
                'description' => 'Traditional multi-purpose coir rope. Strong and weather-resistant.',
                'price' => 450,
                'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
                'category' => 'Raw Materials',
                'stock' => 120,
                'featured_type' => 'Best Seller',
                'is_active' => true,
                'sold_count' => 289
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
