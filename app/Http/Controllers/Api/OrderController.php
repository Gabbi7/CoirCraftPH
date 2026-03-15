<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('items')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_email' => 'required|string',
            'user_name' => 'required|string',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'delivery_method' => 'required|string',
            'delivery_address' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_image' => 'nullable|string',
            'items.*.product_price' => 'required|numeric',
            'items.*.quantity' => 'required|integer',
        ]);

        return DB::transaction(function () use ($validated) {
            $order = Order::create([
                'user_email' => $validated['user_email'],
                'user_name' => $validated['user_name'],
                'total_amount' => $validated['total_amount'],
                'payment_method' => $validated['payment_method'],
                'delivery_method' => $validated['delivery_method'],
                'delivery_address' => $validated['delivery_address'],
                'status' => 'Pending',
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_image' => $item['product_image'] ?? null,
                    'price' => $item['product_price'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $order->load('items');
        });
    }

    public function show($id)
    {
        return Order::with('items')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->only(['status', 'delivery_address']));
        return $order;
    }

    public function destroy($id)
    {
        Order::findOrFail($id)->delete();
        return response()->noContent();
    }
}
