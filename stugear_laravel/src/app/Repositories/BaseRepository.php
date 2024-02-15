<?php

namespace App\Repositories;

use App\Repositories\RepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;

abstract class BaseRepository implements RepositoryInterface
{
    protected $model;

    public function __construct()
    {
        $this->setModel();
    }

    abstract public function getModel();

    public function setModel()
    {
        $this->model = app()->make(
            $this->getModel()
        );
    }

    /**
     * Find model by id return true if find and false if not
     *
     * @param int $id
     *
     * @return mixed
     */
    public function getById($id)
    {
        try {
            $result = $this->model->find($id);
            if (!$result || $result->deleted_by != null || $result->deleted_at != null)
            {
                return false;
            }
            return $result;
        } catch (\Throwable $th) {
            Log::error($th);
            return false;
        }
    }

    /**
     * Insert or update record if id exist, return true if success and false if not
     *
     * @param null|int $id
     * @param array $attributes
     *
     * @return mixed
     */
    public function save($attributes, $id = null)
    {
        try {
            DB::beginTransaction();
            if ($id) {
                $result = $this->model->find($id);
                $result = $result->update($attributes);
            } else {
                $result = $this->model->create($attributes);
            }
            DB::commit();
            return $result;
        } catch (\Throwable $th) {
            Log::error($th);
            DB::rollBack();
            return false;
        }

    }

    /**
     * Insert or update multiple record if id exist, return true if success and false if not
     *
     * @param null|array $ids
     * @param array $attributes
     *
     * @return mixed
     */
    public function saveMany($attributes, $ids = null)
    {
        try {
            DB::beginTransaction();
            $models = [];

            foreach ($attributes as $index => $attribute) {
                $id = $ids[$index];

                if ($id) {
                    $model = $this->model->find($id);
                    $model = $model->update($attribute);
                }
                else {
                    $model = $this->model->save($attribute);
                }
                if (!$model){
                    throw new Exception('Update failed');
                }
                $models[] = $model;
            }
            DB::commit();
            return $models;
        } catch (\Throwable $th) {
            Log::error($th);
            DB::rollBack();
            return false;
        }
    }

    /**
     * Delete record by id, return true if success and false if not
     *
     * @param int $id
     *
     * @return mixed
     */
    public function deleteById($id)
    {
        try {
            $result = $this->model->find($id);
            $result->deleted_date = Carbon::now();
            return $result->save();
        } catch (\Throwable $th) {
            Log::error($th);
            return false;
        }
    }

    public function getAll($limit)
    {
        try {
            $result = $this->model->whereNull('deleted_by')->whereNull('deleted_at')->paginate($limit);
            return $result;
        } catch (\Throwable $th) {
            Log::error($th);
            return false;
        }
    }
}
