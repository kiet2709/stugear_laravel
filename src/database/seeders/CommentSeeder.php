<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker\Factory::create();

        $contents = [
            'Sản phẩm này quá tuyệt vời!',
            'Tôi rất thích sản phẩm này.',
            'Sản phẩm có giá trị tốt cho sự đầu tư.',
            'Chất lượng sản phẩm rất tốt.',
            'Giá cả hợp lý với sản phẩm này.',
            'Sản phẩm giúp tôi giải quyết mọi vấn đề.',
            'Tôi đã mua sản phẩm này và tôi hài lòng.',
            'Sản phẩm đáng để mua.',
            'Sản phẩm hoàn toàn đáp ứng nhu cầu của tôi.',
            'Tôi rất ấn tượng với sản phẩm này.',
            'Sản phẩm này là sự lựa chọn hoàn hảo.',
            'Tôi sẽ giới thiệu sản phẩm này cho bạn bè của mình.',
            'Sản phẩm này đáng để bạn thử nghiệm.',
            'Tôi đã dùng sản phẩm này trong một thời gian dài và rất hài lòng.',
            'Sản phẩm đáng giá tiền.',
            'Tôi đã mua sản phẩm này và tôi không hối hận.',
            'Sản phẩm này làm tôi cảm thấy hạnh phúc.',
            'Sản phẩm chất lượng cao.',
            'Tôi đã dùng nhiều sản phẩm, nhưng sản phẩm này là số 1.',
            'Sản phẩm này giúp tôi tiết kiệm thời gian và công sức.',
            'Tôi yêu sản phẩm này!',
            'Sản phẩm này thật sự đặc biệt.',
            'Tôi đã mua sản phẩm này và nó không làm tôi thất vọng.',
            'Sản phẩm này đáng giá mỗi đồng bạn bỏ ra.',
            'Tôi rất hạnh phúc với sự lựa chọn này.',
            'Sản phẩm này giúp tôi nhanh chóng giải quyết vấn đề của mình.',
            'Tôi đã sử dụng sản phẩm này và nó hoạt động tốt.',
            'Sản phẩm này làm cuộc sống của tôi dễ dàng hơn.',
            'Tôi sẽ mua sản phẩm này lần nữa trong tương lai.',
            'Sản phẩm này đáng để mua và dùng.'
        ];


        // for ($i = 0; $i < 100; $i++) {
        //     $content = $contents[$faker->numberBetween(0, count($contents) -1)];
        //     $vote = $faker->numberBetween(1, 5);
        //     $product_id = $faker->numberBetween(1, 20);
        //     $parent_id = $faker->numberBetween(0, 90);

        //     $owner_id = $faker->numberBetween(2, 10);
        //     $reply_on = $faker->numberBetween(2, 10);
        //     $rating_id = $faker->numberBetween(0,5);

        //     $created_at = $faker->dateTimeThisDecade;
        //     $updated_at = $faker->dateTimeThisDecade;
        //     $created_by = $owner_id;
        //     $updated_by = $owner_id;

        //     DB::table('comments')->insert([
        //         'content' => $content,
        //         'vote' => $vote,
        //         'parent_id' => $parent_id,
        //         'product_id' => $product_id,
        //         'owner_id' => $owner_id,
        //         'reply_on' => $reply_on,
        //         'rating_id' => $rating_id,
        //         'created_by' => $created_by,
        //         'created_at' => $created_at,
        //         'updated_by' => $updated_by,
        //         'updated_at' => $updated_at,
        //     ]);
        // }

        $parentIdStart = 1;
        $parentIdEnd = 5;
        $contentIndex = 0;

        for ($productId = 1; $productId<=20; $productId++) {



            for ($i = 1; $i<=5; $i++ ) {
                $vote = rand(1, 5);
                $owner_id = rand(2, 10);
                $rating_id = rand(0,5);
                $reply_on = rand(0, 10);
                $created_at = $faker->dateTimeThisDecade;
                $updated_at = $faker->dateTimeThisDecade;
                $created_by = $owner_id;
                $updated_by = $owner_id;
                if ($contentIndex == count($contents)) {
                    $contentIndex = 0;
                }
                DB::table('comments')->insert([
                    'content' => $contents[$contentIndex++],
                    'vote' => $vote,
                    'parent_id' => 0,
                    'product_id' => $productId,
                    'owner_id' => $owner_id,
                    'reply_on' => $reply_on,
                    'rating_id' => $rating_id,
                    'created_by' => $created_by,
                    'created_at' => $created_at,
                    'updated_by' => $updated_by,
                    'updated_at' => $updated_at,
                ]);
            }

            for ($i = 1; $i<= 15; $i++ ) {
                $vote = rand(1, 5);
                $owner_id = rand(2, 10);
                $rating_id = rand(0,5);
                $reply_on = rand(0, 10);
                $created_at = $faker->dateTimeThisDecade;
                $updated_at = $faker->dateTimeThisDecade;
                $created_by = $owner_id;
                $updated_by = $owner_id;
                if ($contentIndex == count($contents)) {
                    $contentIndex = 0;
                }
                DB::table('comments')->insert([
                    'content' => $contents[$contentIndex++],
                    'vote' => $vote,
                    'parent_id' => rand($parentIdStart,$parentIdEnd),
                    'product_id' => $productId,
                    'owner_id' => $owner_id,
                    'reply_on' => $reply_on,
                    'rating_id' => $rating_id,
                    'created_by' => $created_by,
                    'created_at' => $created_at,
                    'updated_by' => $updated_by,
                    'updated_at' => $updated_at,
                ]);
            }

            $parentIdStart = $parentIdStart + 20;
            $parentIdEnd = $parentIdEnd + 20;
        }



    }
}
