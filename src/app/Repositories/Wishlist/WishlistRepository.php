<?php

namespace App\Repositories\Wishlist;

use App\Models\Wishlist;
use App\Repositories\BaseRepository;
use App\Repositories\Wishlist\WishlistRepositoryInterface;
use Illuminate\Support\Facades\DB;

class WishlistRepository extends BaseRepository implements WishlistRepositoryInterface
{
    public function getModel()
    {
        return Wishlist::class;
    }

    public function getWishlistByUserId($userId, $limit)
    {
        $wishlistId = $this->model->where("user_id", $userId)->first()->id;
        $results = DB::table("wishlist_products")
            ->where('wishlist_id', $wishlistId)
            ->paginate($limit);
        return $results;
    }

    public function getWishlistByIdAndProductId($wishlistId, $productId)
    {
        $result = DB::table("wishlist_products")->where("product_id", $productId)
                            ->where("wishlist_id", $wishlistId)->first();
        return $result;
    }

    public function addToWishlist($data)
    {
        $results = DB::table("wishlist_products")
            ->insert($data);
        return $results;
    }

    public function updateWishlist($data, $productId, $wishlistId)
    {
        $results = DB::table("wishlist_products")
            ->where('product_id', $productId)
            ->where('wishlist_id', $wishlistId)
            ->update($data);
        return $results;
    }

    public function getWishlistIdByUserId($userId)
    {
        $result = $this->model->where('user_id', $userId)->first();
        return $result->id;
    }
}
