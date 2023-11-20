<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productLimit = 20;

        for ($i = 0; $i < $productLimit; $i++) {
            DB::table('images')->insert([
                'path' => 'uploads/products/' . strval($i+1) . '.png',
                'title' => strval($i+1) . '.png',
                'created_by' => rand(2,10),
                'updated_by' => rand(2,10),
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
        }

        $id = 1;
        for ($i = 0; $i < $productLimit; $i++) {
            DB::table('products')
            ->where('id', $id++)
            ->update([
                'image_id' => strval($i+1),
            ]);
        }

        $userLimit = 10;

        for ($i = 0; $i < $userLimit; $i++) {
            DB::table('images')->insert([
                'path' => 'uploads/users/' . strval($i+1)  . '.png',
                'title' => strval($i+1) . '.png',
                'created_by' => strval($i+1),
                'updated_by' => strval($i+1),
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
        }

        $id = 1;
        for ($i = $productLimit; $i < $productLimit + $userLimit; $i++) {
            DB::table('users')
            ->where('id', $id++)
            ->update([
                'image_id' => strval($i+1),
            ]);
        }

        $categoryLimit = 3;

        for ($i = 0; $i < $categoryLimit; $i++) {
            DB::table('images')->insert([
                'path' => 'uploads/categories/' . strval($i+1)  . '.png',
                'title' => strval($i+1) . '.png',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
        }

        $id = 1;
        for ($i = $productLimit + $userLimit; $i < $productLimit + $userLimit + $categoryLimit; $i++) {
            DB::table('categories')
            ->where('id', $id++)
            ->update([
                'image_id' => strval($i+1),
            ]);
        }
    }
}
