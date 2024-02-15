<?php

namespace App\Repositories\Tag;

use App\Repositories\RepositoryInterface;

interface TagRepositoryInterface extends RepositoryInterface
{
    public function findByTagName($name);
    public function getProductTagsByTagId($id, $limit);

}
