<?php

namespace App\Repositories\Tag;

use App\Models\Tag;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\DB;

class TagRepository extends BaseRepository implements TagRepositoryInterface
{
    public function getModel()
    {
        return Tag::class;
    }

    public function findByTagName($name)
    {
        $tag = $this->model->where("name", $name)->first();
        if ($tag) {
            return $tag;
        } else {
            return false;
        }
    }

    public function getProductTagsByTagId($id, $limit)
    {
        $result = DB::table('product_tags')
        ->where('tag_id', $id)->paginate($limit);
        return $result;
    }
}
