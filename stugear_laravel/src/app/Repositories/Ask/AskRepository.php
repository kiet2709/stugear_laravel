<?php

namespace App\Repositories\Ask;

use App\Models\Ask;
use App\Repositories\BaseRepository;

class AskRepository extends BaseRepository implements AskRepositoryInterface
{
    public function getModel()
    {
        return Ask::class;
    }

    public function getListAskByType($type, $limit)
    {
        $asks = Ask::where('type', $type)->paginate($limit);
        return $asks;
    }

    public function getListAskByCurrentUser($type, $limit, $userId)
    {
        $asks = Ask::where('type', $type)->where('owner_id', $userId)->paginate($limit);
        return $asks;
    }
}
