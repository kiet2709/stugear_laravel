<?php

namespace App\Repositories\Wishlist;

use App\Repositories\RepositoryInterface;

interface WishlistRepositoryInterface extends RepositoryInterface
{
    public function getWishlistByUserId($userId, $limit);
    public function addToWishlist($data);
    public function updateWishlist($data, $productId, $wishlistId);
    public function getWishlistByIdAndProductId($wishlistId, $productId);
    public function getWishlistIdByUserId($userId);
}
