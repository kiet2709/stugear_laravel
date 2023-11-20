<?php

namespace App\Repositories\Comment;

use App\Models\Comment;
use App\Repositories\BaseRepository;
use App\Repositories\Comment\CommentRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CommentRepository extends BaseRepository implements CommentRepositoryInterface
{
    public function getModel()
    {
        return Comment::class;
    }

    public function getCommentByProductId($id, $limit)
    {
        $result = DB::table('comments')
            ->where('product_id', $id )->paginate( $limit );
        return $result;
    }

    public function getCommentByParentId($id)
    {
        $result = DB::table('comments')
        ->where('parent_id', $id )->get();
        return $result;
    }

    public function getCommentWithParentIdZeroByProductId($id, $limit)
    {
        $result = DB::table('comments')
            ->where('product_id', $id )
            ->where('parent_id', 0 )
            ->orderBy('updated_at','desc')
            ->paginate( $limit );
        return $result;
    }

}
