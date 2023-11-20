<?php

namespace App\Repositories\Rating;

use App\Models\Rating;
use App\Repositories\BaseRepository;
use App\Repositories\Rating\RatingRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RatingRepository extends BaseRepository implements RatingRepositoryInterface
{
    public function getModel()
    {
        return Rating::class;
    }

    public function getRatingByProductId($id)
    {
        $result = DB::table('rating_products')
            ->where('product_id', $id )->get();
        return $result;
    }

    public function rating($product_id, $rating, $userId)
    {
        $result = DB::table('rating_products')
        ->where('product_id', $product_id)
        ->where('rating_id', $rating)
        ->update([
            'quantity' => DB::raw('quantity + 1'),
            'updated_by' => $userId,
            'updated_at' => Carbon::now(),
        ]);
        return $result;
    }
}
