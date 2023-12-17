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

}
