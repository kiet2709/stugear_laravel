<?php

namespace App\Repositories\Order;

use App\Models\Order;
use App\Models\Product;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\DB;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function getModel()
    {
        return Order::class;
    }

    public function getCurrentUserOrdersHistory($userId, $limit)
    {
        $orders = Order::where('user_id', '=', $userId)->paginate($limit);
        return $orders;
    }

    public function getCurrentUserOrders($sellerId, $limit)
    {
        $orders = Order::where('seller_id', '=', $sellerId)->paginate($limit);
        return $orders;
    }

    public function getCompleteOrder($id)
    {
        $orders = $orders = DB::table('orders')
        ->join('products', 'orders.product_id', '=', 'products.id')
        ->join('categories', 'products.category_id', '=', 'categories.id')
        ->select('orders.*')
        ->where('orders.status', '=', 4)
        ->where('categories.id', '=', $id)
        ->get();
        return $orders;
    }

    public function getOrdersWorkingByProductId($productId)
    {
        $orders = Order::where('product_id', '=', $productId)->where('status', '!=', 4)->get();
        return $orders;
    }

}
