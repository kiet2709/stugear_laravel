<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Sách',
                'description' => 'Đây là danh mục chứa các cuốn sách về nhiều chủ đề và lĩnh vực khác nhau.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Tài liệu',
                'description' => 'Đây là danh mục chứa các tài liệu và thông tin liên quan đến nhiều lĩnh vực và chủ đề khác nhau.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Linh kiện',
                'description' => 'Đây là danh mục chứa các linh kiện và phụ tùng liên quan đến nhiều lĩnh vực khác nhau, bao gồm điện tử, cơ khí, công nghiệp, và nhiều lĩnh vực khác.',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'name' => $category['name'],
                'description' => $category['description'],
                'created_by' => $category['created_by'],
                'updated_by' => $category['updated_by'],
                'created_at' => $category['created_at'],
                'updated_at' => $category['updated_at'],
            ]);
        }
    }
}
