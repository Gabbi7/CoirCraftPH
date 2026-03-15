<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Product::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        
        $products = [
            // Gardening
            [
                'name' => 'Coco Peat',
                'description' => 'Premium compressed coco peat. High water retention, perfect for soil conditioning.',
                'price' => 120,
                'image_url' => 'https://indonesiacocopeat.com/mymedia/2021/12/Jual-Cocopeat-Bogor.jpg',
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
                'image_url' => 'https://vinatap.vn/uploads/images/mun-dua/vinatap-cocopeatvietnam192.jpeg',
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
                'image_url' => 'https://cdn.shopify.com/s/files/1/0707/9434/6746/files/coir_pots_2.png?v=1754557892',
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
                'image_url' => 'https://m.media-amazon.com/images/I/912pn-nL-EL._AC_SL1000__.jpg',
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
                'image_url' => 'https://www.shutterstock.com/image-photo/brushes-scrubbers-made-coconut-coir-600nw-2483763379.jpg',
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
                'image_url' => 'https://siridepot.com/media/mageplaza/blog/post/c/o/coir_log_1.png',
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
                'image_url' => 'https://www.overlakesupply.com/cdn/shop/products/Coir_Mat_700_3_2_787x431.jpg?v=1582906885',
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
                'image_url' => 'https://i0.wp.com/textilelearner.net/wp-content/uploads/2015/06/Coconut-fiber.jpg?resize=400%2C300&ssl=1',
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
                'image_url' => 'https://services.ibo.com/media/v1/products/images/c20e866d-8138-4eda-a478-3f17184a0432/brown-coconut-coir-rope-1.webp?c_type=C3',
                'category' => 'Raw Materials',
                'stock' => 120,
                'featured_type' => 'Best Seller',
                'is_active' => true,
                'sold_count' => 289
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['name' => $product['name']], $product);
        }
    }
}
