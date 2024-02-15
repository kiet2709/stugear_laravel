<?php

namespace App\Repositories\Ask;

use App\Repositories\RepositoryInterface;

interface AskRepositoryInterface extends RepositoryInterface
{
    public function getListAskByType($type, $limit);
    public function getListAskByCurrentUser($type, $limit, $userId);
}
