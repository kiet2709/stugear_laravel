<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = DB::table('products')->limit(30)->get();

        foreach ($products as $product) {
            do {
                $user_id = rand(1, 8);
            } while ($user_id == $product->user_id);
            $quantity = rand(1,4);
            DB::table('orders')->insert([
                'user_id' => $user_id,
                'seller_id' => $product->user_id,
                'product_id' => $product->id,
                'price' => $product->price,
                'quantity' => $quantity,
                'total' => $product->price * $quantity,
                'status' => 4,
                'created_by' => $user_id,
                'updated_by' => $user_id,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
        }


    }
}
