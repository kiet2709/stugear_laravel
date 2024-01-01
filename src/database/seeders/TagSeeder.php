<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $limit = 10;

        $colors = [
            'bg-primary',
            'bg-secondary',
            'bg-success',
            'bg-danger',
            'bg-warning',
            'bg-info',
            'bg-dark',
        ];

        $tagNames = [
            'sach', 'dodung', 'sach', 'tailieu', 'document', 'book', 'electronic',
            'electron', 'hoc', 'moi', 'cu', 'passlai', 'passgap', 'giare', 'giahatde',
            'gan', 'xa'
        ];

        for ($i = 0; $i < $limit; $i++) {
            $user = rand(1,10);
            DB::table('tags')->insert([
                'name' => $tagNames[array_rand($tagNames)] . rand(1,100),
                'color' => $colors[array_rand($colors)],
                'created_by' => $user,
                'updated_by' => $user,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]);
        }

        $maxProductId = 35;
        $maxTagId = 10;

        for ($productId = 1; $productId <= $maxProductId; $productId++) {
            // Random number of tags for each product (between 1 and 4)
            $numberOfTags = rand(1, 4);

            // Array to keep track of assigned tags to avoid duplicates
            $assignedTags = [];

            for ($j = 0; $j < $numberOfTags; $j++) {
                do {
                    // Random tagId
                    $tagId = rand(1, $maxTagId);
                } while (in_array($tagId, $assignedTags)); // Ensure unique tagId for each product

                $user = rand(1, 10);

                // Insert product_tag into the database
                DB::table('product_tags')->insert([
                    'product_id' => $productId,
                    'tag_id' => $tagId,
                    'created_by' => $user,
                    'updated_by' => $user,
                    'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                    'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
                ]);

                // Add the tag to the assignedTags array to avoid duplication
                $assignedTags[] = $tagId;
            }
        }
    }
}
