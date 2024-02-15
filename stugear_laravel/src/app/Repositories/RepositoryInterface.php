<?php

namespace App\Repositories;

interface RepositoryInterface
{
    public function getById($id);
    public function save($attributes, $id = null);
    public function saveMany($attributes, $ids = null);
    public function deleteById($id);

    public function getAll($limit);
}
