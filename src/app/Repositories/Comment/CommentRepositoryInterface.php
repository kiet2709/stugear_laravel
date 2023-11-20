<?php

namespace App\Repositories\Comment;

use App\Repositories\RepositoryInterface;

interface CommentRepositoryInterface extends RepositoryInterface
{
    public function getCommentByProductId($id, $limit);

    public function getCommentByParentId($id);

    public function getCommentWithParentIdZeroByProductId($id, $limit);

}
