<?php

namespace App\Repositories\Product;

use App\Models\Product;
use App\Repositories\BaseRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function getModel()
    {
        return Product::class;
    }

    public function getProductById($id)
    {
        $category = $this->model->find($id);
        if (!$category || $this->model->isDirty('deleted_by') || $this->model->isDirty('deleted_at'))
        {
            return false;
        }

        return $category;

    }

    public function searchByName($q)
    {
        $products = $this->model->where('name','LIKE','%'. $q .'%')
        ->whereNull('deleted_by')
        ->whereNull('deleted_at')
        ->get();
        return $products;
    }

    public function attachTag($id, $tags, $userId)
    {
        $product = $this->model->find($id);
        if (empty($tags)) {
            return true;
        }
        $tagIds = DB::table('product_tags')
        ->where('product_id', $id)
        ->pluck('tag_id')
        ->toArray();
        foreach ($tags as $key => $tag) {
            if (in_array($tag, $tagIds)) {
                unset($tags[$key]);
            }
        }
        // $tag = array_diff_assoc($tagIds, $tags);
        if (empty($tags)) {
            return DB::table('product_tags')
            ->where('product_id', $id)
            ->pluck('tag_id')
            ->toArray();
        }
        foreach ($tags as $tag) {
            $insertData[] = [
                'product_id' => $id,
                'tag_id' => $tag,
                'created_at' => Carbon::now(),
                'updated_at'=> Carbon::now(),
                'created_by' => $userId,
                'updated_by' => $userId
            ];
        }
        DB::table('product_tags')->insert($insertData);
        $result = DB::table('product_tags')
        ->where('product_id', $id)
        ->pluck('tag_id')
        ->toArray();
        return $result;
    }

    public function getProductByCategoryId($id, $limit)
    {
        $result = DB::table('products')
        ->where('category_id', $id)
        ->whereNotIn('status', [0, 1, 2, 5])
        ->whereNull('deleted_by')
        ->whereNull('deleted_at')
        ->paginate($limit);
        return $result;
    }

    public function getProductTagsByProductId($id)
    {
        $result = DB::table('product_tags')
            ->where('product_id', $id)
            ->whereNull('deleted_by')
            ->whereNull('deleted_at')
            ->get();
        return $result;
    }

    public function getProductByCurrentUser($userId, $limit)
    {
        $result = DB::table('products')
        ->where('user_id', $userId)
        ->whereNull('deleted_by')
        ->whereNull('deleted_at')
        ->paginate($limit);
        return $result;
    }

    public function searchWithCriteria($request, $limit)
    {
        $query = Product::query();

        $query->join('users','users.id','=','products.user_id');
        $query->join('product_tags', 'products.id', '=', 'product_tags.product_id');

        if ($request->q != null) {
            $query->where(function($q) use ($request) {
                $q->where('products.name', 'LIKE', '%' . $request->q . '%')
                    ->orWhere('users.name', 'LIKE', '%' . $request->q . '%')
                    ->orWhere('products.description', 'LIKE', '%' . $request->q . '%' );
            });
        }



        if ($request->status != null || !empty($request->status)) {
            foreach ($request->status as $status) {
                if ($status == 0 ||
                $status == 1 ||
                $status == 2 ||
                $status == 5) {
                    return "status";
                }
            }
            $query->whereIn('products.status', $request->status);
        }




        if ($request->category_id != null || !empty($request->category_id)) {
            $query->whereIn('products.category_id', $request->category_id);
        }

        if ($request->tags != null || !empty($request->tags)) {
            $query->whereIn('product_tags.tag_id', $request->tags);
        }

// ---------------- begin handle condition --------------------

        if (empty($request->condition)) {
            $condition = [1,2];
        } else {
            foreach ($request->condition as $condition_member) {
                if ($condition_member != 1 && $condition_member != 2) {
                    return 'condition';
                }
            }
        }

        $condition = $request->condition;
        if ($request->condition != null) {
            $query->whereIn('products.condition', $condition);
        }

// ---------------- end handle condition --------------------


// ---------------- begin handle transaction method --------------------

        if (empty($request->transaction_method)) {
            $transaction_method = [1,2];
        } else {
            foreach ($request->transaction_method as $transaction_method_member) {
                if ($transaction_method_member != 1 && $transaction_method_member != 2) {
                    return 'transaction_method';
                }
            }
        }

        $transaction_method = $request->transaction_method;
        if ($request->transaction_method != null || !empty($request->transaction_method)) {
            $query->whereIn('products.transaction_id', $transaction_method);
        }

// ---------------- end handle transaction method --------------------

// ---------------- begin handle price method --------------------

        if ($request->price_from == "") {
            $query->where('products.price', '>=', 0);
        } else if ($request->price_from != null) {
            $query->where('products.price', '>=', $request->price_from);
        }

        if ($request->price_to == "") {
            $query->where('products.price', '<=', 1000000000);
        } else if ($request->price_to != null) {
            $query->where('products.price', '<=', $request->price_to);
        }

// ---------------- end handle price method --------------------


// ---------------- begin handle date method --------------------


        if ($request->date_from != null) {
            if ($request->date_from == "") {
                $dateFrom = Carbon::createFromFormat('d/m/Y', '1/1/2016')->startOfDay();
            }
            if (strpos($request->date_from, '/') !== false) {
                // Nếu có dấu '/', sử dụng định dạng d/m/y
                $dateFrom = Carbon::createFromFormat('d/m/Y', $request->date_from)->startOfDay();
            }
            if (strpos($request->date_from, '-') !== false) {
                // Nếu có dấu '-', sử dụng định dạng d-m-y
                $dateFrom = Carbon::createFromFormat('d-m-Y', $request->date_from)->startOfDay();
            }
            $query->where('products.updated_at', '>=', $dateFrom);
        }

        if ($request->date_to != null) {
            if ($request->date_to == "") {
                $dateTo = Carbon::now()->endOfDay();
            }
            if (strpos($request->date_to, '/') !== false) {
                // Nếu có dấu '/', sử dụng định dạng d/m/y
                $dateTo = Carbon::createFromFormat('d/m/Y', $request->date_to)->endOfDay();
            }
            if (strpos($request->date_to, '-') !== false) {
                // Nếu có dấu '-', sử dụng định dạng d-m-y
                $dateTo = Carbon::createFromFormat('d-m-Y', $request->date_to)->endOfDay();
            }
            $query->where('products.updated_at', '<=', $dateTo);
        }

// ---------------- end handle date method --------------------

        $query->whereNull('products.deleted_at')->whereNull('products.deleted_by');
        $query->where('products.status', '!=', 0);
        $query->where('products.status', '!=', 1);
        $query->where('products.status', '!=', 2);
        $query->where('products.status', '!=', 5);

        return $query->select('products.*')
        ->distinct('products.id')
        ->paginate($limit);
        // return $query;
    }

}
