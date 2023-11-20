<?php

namespace App\Repositories\Product;

use App\Repositories\RepositoryInterface;

interface ProductRepositoryInterface extends RepositoryInterface
{
    public function getProductById($id);

    public function searchByName($q);

    public function attachTag($id, $tags, $userId);

    public function getProductByCategoryId($id, $limit);
    // public function getProductByTagId($id, $limit);

    public function getProductTagsByProductId($id);

    public function getProductByCurrentUser($userId, $limit);

    public function searchWithCriteria($request, $limit);
}
