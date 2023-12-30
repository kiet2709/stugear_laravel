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

    public function getCompleteOrder()
    {
        $orders = Order::where('status', '=', 4)->get();
        return $orders;
    }

    public function getOrdersWorkingByProductId($productId)
    {
        $orders = Order::where('product_id', '=', $productId)->where('status', '!=', 4)->get();
        return $orders;
    }

}
