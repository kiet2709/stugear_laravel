<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'description',
        'condition',
        'edition',
        'origin_price',
        'quantity',
        'status',
        'brand',
        'user_id',
        'category_id',
        'transaction_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'deleted_at',
        'deleted_by'
    ];

    protected $hidden = [
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'deleted_at',
        'deleted_by'
    ];

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y');
    }

    public function getStatusAttribute($value)
    {
        $result = '';
        switch ($value) {
            case 0:
                $result = 'Chặn';
                break;
            case 1:
                $result = 'Nháp';
                break;
            case 2:
                $result = 'Chờ duyệt';
                break;
            case 3:
                $result = 'Đã duyệt';
                break;
            case 4:
                $result = 'Đã bán';
                break;
            case 5:
                $result = 'Đã thanh toán';
                break;
        }
        return $result;
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function productTags()
    {
        return $this->hasMany(ProductTag::class);
    }
}
