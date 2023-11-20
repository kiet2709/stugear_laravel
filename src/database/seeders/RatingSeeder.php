<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 5; $i++) {
            DB::table('ratings')->insert([
                'star' => $i+1,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
        }

        $rating = 1;
        $productId = 1;
        for ($i = 0; $i < 5*20; $i++) {
            $user = rand(2,10);
            if ($rating > 5) {
                $rating = 1;
                $productId ++;
            }
            DB::table('rating_products')->insert([
                'product_id' => $productId,
                'rating_id' => $rating,
                'quantity' => rand(15,100),
                'created_by' => $user,
                'updated_by' => $user,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
            $rating++;
        }

    }
}
