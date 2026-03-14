<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Sample Products
        $sampleProducts = [
            ['name' => 'Premium Coir Rope 3mm', 'description' => 'Durable twisted coconut coir rope ideal for garden trellising, craft projects, and plant support. 100% natural fiber.', 'price' => 185, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Rope', 'stock' => 120, 'featured_type' => 'Best Seller', 'is_active' => true, 'sold_count' => 245],
            ['name' => 'Coir Door Mat 60x40cm', 'description' => 'Classic handwoven coir door mat with natural anti-slip backing. Perfect for entryways and patios.', 'price' => 320, 'image_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', 'category' => 'Coir Mat', 'stock' => 65, 'featured_type' => 'Trending', 'is_active' => true, 'sold_count' => 189],
            ['name' => 'Erosion Control Coir Net', 'description' => 'Biodegradable coir netting for slope erosion control and garden bed protection. UV resistant.', 'price' => 780, 'image_url' => 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80', 'category' => 'Coir Net', 'stock' => 40, 'featured_type' => 'New', 'is_active' => true, 'sold_count' => 67],
            ['name' => 'Coir Hanging Basket Pot', 'description' => 'Natural coconut coir liner pot for hanging baskets. Excellent water retention for lush plant growth.', 'price' => 95, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Pot', 'stock' => 200, 'featured_type' => 'Best Seller', 'is_active' => true, 'sold_count' => 412],
            ['name' => 'Coir Board 100x50cm', 'description' => 'Compressed coir fiber board for crafts, insulation, and garden projects. Eco-friendly alternative.', 'price' => 550, 'image_url' => 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80', 'category' => 'Coir Board', 'stock' => 30, 'featured_type' => 'None', 'is_active' => true, 'sold_count' => 28],
            ['name' => 'Loose Coir Fiber 5kg', 'description' => 'Premium grade loose coir fiber for potting mix, composting, and mulching. pH balanced and weed-free.', 'price' => 240, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Fiber', 'stock' => 88, 'featured_type' => 'None', 'is_active' => true, 'sold_count' => 134],
            ['name' => 'Coir Grow Bag 10L', 'description' => 'Ready-to-use coconut coir grow bag perfect for hydroponic tomatoes, peppers, and cucumbers. Pre-buffered.', 'price' => 180, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Grow Bag', 'stock' => 75, 'featured_type' => 'Trending', 'is_active' => true, 'sold_count' => 156],
            ['name' => 'Coir Rope 10mm Thick', 'description' => 'Heavy duty 10mm coconut coir rope. Perfect for rustic decor, marine use, and rope bridges.', 'price' => 450, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Rope', 'stock' => 55, 'featured_type' => 'None', 'is_active' => true, 'sold_count' => 92],
            ['name' => 'Decorative Coir Mat 90x60cm', 'description' => 'Beautiful hand-carved coir door mat with tropical leaf design. Weather resistant and durable.', 'price' => 680, 'image_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', 'category' => 'Coir Mat', 'stock' => 5, 'featured_type' => 'New', 'is_active' => true, 'sold_count' => 23],
            ['name' => 'Mini Coir Pots Set (12pcs)', 'description' => 'Biodegradable mini coir seed starter pots. Transplant directly into soil — roots grow through naturally.', 'price' => 140, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Pot', 'stock' => 150, 'featured_type' => 'Best Seller', 'is_active' => true, 'sold_count' => 328],
            ['name' => 'Coir Grow Bag 20L', 'description' => 'Large format coconut coir grow bag for professional hydroponic cultivation. Pre-wetted and ready to use.', 'price' => 320, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Grow Bag', 'stock' => 3, 'featured_type' => 'None', 'is_active' => true, 'sold_count' => 78],
            ['name' => 'Natural Coir Fiber Block 650g', 'description' => 'Compressed coir peat block expands to 9L of rich growing medium. Just add water. 100% organic.', 'price' => 85, 'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 'category' => 'Coir Fiber', 'stock' => 200, 'featured_type' => 'Trending', 'is_active' => true, 'sold_count' => 267],
        ];

        foreach ($sampleProducts as $product) {
            \App\Models\Product::create($product);
        }

        // Demo users
        $users = [
            ['email' => 'buyer@cocofiber.ph', 'password' => bcrypt('password'), 'name' => 'Juan dela Cruz', 'role' => 'user', 'mobile_number' => '09171234567', 'address' => '123 Aguinaldo St, Quezon City', 'profile_image' => ''],
            ['email' => 'admin@cocofiber.ph', 'password' => bcrypt('password'), 'name' => 'Maria Santos', 'role' => 'admin', 'mobile_number' => '09281234567', 'address' => '456 Rizal Ave, Manila', 'profile_image' => ''],
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
