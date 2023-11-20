<?php

namespace App\Observers;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class ModelObserver
{
    public function creating(Model $model): void
    {
        $model->created_at = Carbon::now();
        $model->updated_by = auth()->id();
    }

    /**
     * Handle the model "updated" and "deleted" event.
     */
    public function updating(Model $model): void
    {
        if ($model->isDirty('deleted_date')) {
            $model->deleted_at = Carbon::now();
            $model->deleted_by = auth()->id();
        } else {
            $model->updated_at = Carbon::now();
            $model->updated_by = auth()->id();
        }
    }
}
