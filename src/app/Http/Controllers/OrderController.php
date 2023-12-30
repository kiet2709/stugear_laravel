<?php

namespace App\Http\Controllers;

use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface;
use Illuminate\Http\Request;
use App\Util\AuthService;
use App\Repositories\User\UserRepositoryInterface;
use Carbon\Carbon;
use App\Util\AppConstant;


class OrderController extends Controller
{

    protected $userRepository;
    protected $orderRepository;
    protected $productRepository;

    public function __construct(UserRepositoryInterface $userRepository, OrderRepositoryInterface $orderRepository, ProductRepositoryInterface $productRepository)
    {
        $this->userRepository = $userRepository;
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
    }

    public function create(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $user = $this->userRepository->getById($userId);

        // tạo order repository
        // lưu order với số tiền, quantity, ngày, và user ID, product ID
        if ($request->quantity == 0) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Số lượng lỗi'
            ], 400);
        }

        if (!isset($request->product_id) || $request->product_id == null || $request->product_id == 0) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Hãy truyền sản phẩm phù hợp'
            ], 400);
        }

        $product = $this->productRepository->getById($request->product_id);

        if ($request->quantity > $product->quantity) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Số lượng mua vượt giới hạn'
            ], 400);
        }

        $total = $product->price * $request->quantity;

        if ($user->wallet < $total) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Số dư không đủ!'
            ], 400);
        }

        $this->userRepository->save([
            'wallet' => $user->wallet - $total,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $userId);

        $dataUpdateProduct = [
            'quantity' => $product->quantity - $request->quantity,
            'updated_at' => Carbon::now()
        ];

        if ($product->quantity == $request->quantity) {
            $dataUpdateProduct['status'] = 4;
        }

        $this->productRepository->save($dataUpdateProduct, $request->product_id);

        $order = $this->orderRepository->save([
            'user_id' => $userId,
            'seller_id' => $product->user_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'price' => $product->price,
            'total' => $total,
            'status' => 1,
            'created_by' => $userId,
            'updated_by' => $userId,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        return response()->json([
            'status' => 'thành công',
            'message' => 'Tạo đơn hàng thành công',
            'data' => [
                'order_id' => $order->id
            ]
        ]);

        // trừ tiền trong ví của user ID
    }

    private function getStatus($status)
    {
        switch ($status) {
            case 1:
                return 'Đang xử lý';
            case 2:
                return 'Đang giao hàng';
            case 3:
                return 'Đã giao hàng';
            case 4:
                return 'Đã nhận được hàng';
            case 5:
                return 'Hoàn hàng';
            case 6:
                return 'Đã nhận được hàng hoàn';
            case 7:
                return 'Hoàn tiền';
            case 8:
                return 'Đã hủy';
        }
    }

    public function getOrderById(Request $request, $id) {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $user = $this->userRepository->getById($userId);
        $order = $this->orderRepository->getById($id);
        if (!$order) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không tồn tại đơn hàng này!'
            ], 400);
        }

        $product = $this->productRepository->getById($order->product_id);

        if ($product->user_id != $user->id && $user->id != $order->user_id) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không có quyền đơn hàng này!'
            ], 400);
        }

        $data = [];
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => [
                'id' => $order->id,
                'product_image' => AppConstant::$DOMAIN . 'api/products/' . $order->product_id . '/images',
                'product_title' => $product->name,
                'product_price' => $order->price,
                'quantity' => $order->quantity,
                'status' => $this->getStatus($order->status),
                'created_date' => Carbon::parse( $order->created_at)->format('d/m/Y'),
                'total_price' => $order->total,
                'owner_id' => $order->seller_id,
                'buyer_id' => $order->user_id
            ]
        ]);
    }

    public function getCurrentUserOrdersHistory(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $limit = $request->limit ?? 5;

        $orders = $this->orderRepository->getCurrentUserOrdersHistory($userId, $limit);
        $data = [];
        $memberData = [];
        $countProductPerPage = 0;
        foreach ($orders as $order) {
            $countProductPerPage++;
            $memberData['id'] = $order->id;
            $memberData['product_id'] = $order->product_id;
            $product = $this->productRepository->getById($order->product_id);
            $memberData['product_title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $order->product_id . '/images';
            $memberData['status'] = $this->getStatus($order->status);
            $memberData['created_date'] = Carbon::parse( $order->created_at)->format('d/m/Y');
            array_push($data, $memberData);
        }
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_items' => $countProductPerPage,
            'total_pages' => $orders->lastPage(),
            'total_in_all_page' => $orders->total()
        ]);

    }

    public function getCurrentUserOrders(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $limit = $request->limit ?? 5;

        $orders = $this->orderRepository->getCurrentUserOrders($userId, $limit);
        $data = [];
        $memberData = [];
        $countProductPerPage = 0;
        foreach ($orders as $order) {
            $countProductPerPage++;
            $memberData['id'] = $order->id;
            $memberData['product_id'] = $order->product_id;
            $product = $this->productRepository->getById($order->product_id);
            $memberData['product_title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $order->product_id . '/images';
            $memberData['status'] = $this->getStatus($order->status);
            $memberData['created_date'] = Carbon::parse( $order->created_at)->format('d/m/Y');
            array_push($data, $memberData);
        }
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_items' => $countProductPerPage,
            'total_pages' => $orders->lastPage(),
            'total_in_all_page' => $orders->total()
        ]);

    }

    private function rollbackStatusProduct($productId)
    {
        $dataUpdateProduct = [
            'status' => 3,
            'updated_at' => Carbon::now()
        ];

        $this->productRepository->save($dataUpdateProduct, $productId);
    }

    private function updateFinishProduct($productId)
    {
        $product = $this->productRepository->getById($productId);
        if ($product->status == 4) {
            $dataUpdateProduct = [
                'status' => 5,
                'updated_at' => Carbon::now()
            ];

            $this->productRepository->save($dataUpdateProduct, $productId);
        }
    }

    public function updateStatusBySeller(Request $request, $id) {
        // lấy order bằng ID
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $order = $this->orderRepository->getById($id);

        if ($userId != $order->seller_id)
        {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Phải là người bán mới được cập nhật các trạng thái này!',
            ], 400);
        }

        // if ($request->status == 6 && $order->status != 5)
        // {
        //     return response()->json([
        //         'status' => 'Lỗi',
        //         'message' => 'Không thể cập nhật trạng thái này nếu đơn hàng chưa ở trạng thái hoàn hàng!',
        //     ], 400);
        // }

        if ($request->status != 2 && $request->status != 3 && $request->status != 6 && $request->status != 8) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái cập nhật không phù hợp!',
            ], 400);
        }
        $buyer = $this->userRepository->getById($order->user_id);

        // if ($request->status == 8) {
        //     if ($order->status != 1 || $order->status != 2) {
        //         return response()->json([
        //             'status' => 'Lỗi',
        //             'message' => 'Trạng thái cập nhật không phù hợp!',
        //         ], 400);
        //     }
        //     $this->userRepository->save([
        //         'wallet' => $buyer->wallet + $order->total,
        //         'updated_by' => $userId,
        //         'updated_at' => Carbon::now()
        //     ], $order->user_id);
        // }

        // if ($request->status == 6) {
        //     $this->userRepository->save([
        //         'wallet' => $buyer->wallet + $order->total,
        //         'updated_by' => $userId,
        //         'updated_at' => Carbon::now()
        //     ], $order->user_id);
        // }

        // $this->orderRepository->save([
        //     'status' => $request->status,
        //     'updated_by' => $userId,
        //     'updated_at' => Carbon::now()
        // ], $id);


        if ($order->status == 1) {
            if ($request->status != 2 && $request->status != 8) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Trạng thái cập nhật không phù hợp!',
                ], 400);
            }
            if ($request->status == 8) {
                $this->addMoneyForBuyer($buyer, $order, $userId);
                $this->handleUpdateOrder($request, $userId, $id);
                $this->rollbackQuantityProduct($id, $userId);
                $this->rollbackStatusProduct($order->product_id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
            if ($request->status == 2) {
                $this->handleUpdateOrder($request, $userId, $id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
        } else if ($order->status == 2) {
            if ($request->status != 3 && $request->status != 8) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Trạng thái cập nhật không phù hợp!',
                ], 400);
            }
            if ($request->status == 8) {
                $this->addMoneyForBuyer($buyer, $order, $userId);
                $this->handleUpdateOrder($request, $userId, $id);
                $this->rollbackStatusProduct($order->product_id);
                $this->rollbackStatusProduct($order->product_id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
            if ($request->status == 3) {
                $this->handleUpdateOrder($request, $userId, $id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
        } else if ($order->status == 5) {
            if ($request->status != 6) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Trạng thái cập nhật không phù hợp!',
                ], 400);
            }
            $this->handleUpdateOrder($request, $userId, $id);
            $this->rollbackQuantityProduct($id, $userId);
            $this->rollbackStatusProduct($order->product_id);
        } else {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái cập nhật không phù hợp!',
            ], 400);
        }

        // cập nhật status

        // return response()->json([
        //     'status' => 'Thành công',
        //     'message' => 'Cập nhật trạng thái đơn hàng thành công',
        // ]);
    }

    private function handleUpdateOrder(Request $request, $userId, $id){
        $this->orderRepository->save([
            'status' => $request->status,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $id);
    }

    private function rollbackQuantityProduct($orderId, $userId)
    {
        $order = $this->orderRepository->getById($orderId);
        $product = $this->productRepository->getById($order->product_id);
        $this->productRepository->save([
            'quantity' => $product->quantity + $order->quantity,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ]);
    }

    private function addMoneyForBuyer($buyer, $order, $userId)
    {
        $this->userRepository->save([
            'wallet' => $buyer->wallet + $order->total,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $order->user_id);
    }

    public function updateStatusByBuyer(Request $request ,$id)
    {
        // lấy order bằng ID
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $order = $this->orderRepository->getById($id);

        if ($userId != $order->user_id)
        {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Phải là người mua mới được cập nhật các trạng thái này!',
            ], 400);
        }

        // if ($request->status == 5 && $order->status != 3)
        // {
        //     return response()->json([
        //         'status' => 'Lỗi',
        //         'message' => 'Không thể cập nhật trạng thái này nếu đơn hàng chưa ở trạng thái đã giao hàng!',
        //     ], 400);
        // }

        // if ($request->status == 5 && $order->status != 4)
        // {
        //     return response()->json([
        //         'status' => 'Lỗi',
        //         'message' => 'Không thể cập nhật trạng thái này nếu đơn hàng đã ở trạng thái đã nhận được hàng!',
        //     ], 400);
        // }

        if ($request->status != 4 && $request->status != 5 && $request->status != 8) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái cập nhật không phù hợp!',
            ], 400);
        }

        $seller = $this->userRepository->getById($order->seller_id);
        $buyer = $this->userRepository->getById($order->user_id);


        // if ($request->status == 4) {
        //     $this->userRepository->save([
        //         'wallet' => $seller->wallet + $order->total,
        //         'updated_by' => $userId,
        //         'updated_at' => Carbon::now()
        //     ], $order->seller_id);
        // }

        // $this->orderRepository->save([
        //     'status' => $request->status,
        //     'updated_by' => $userId,
        //     'updated_at' => Carbon::now()
        // ], $id);

        if ($order->status == 1) {
            if ($request->status != 8) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Trạng thái cập nhật không phù hợp!',
                ], 400);
            }
            if ($request->status == 8) {
                $this->addMoneyForBuyer($buyer, $order, $userId);
                $this->handleUpdateOrder($request, $userId, $id);
                $this->rollbackQuantityProduct($id, $userId);
                $this->rollbackStatusProduct($order->product_id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
        } else if($order->status == 3) {
            if ($request->status != 4 && $request->status != 5) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Trạng thái cập nhật không phù hợp!',
                ], 400);
            }
            if ($request->status == 4) {
                $this->userRepository->save([
                    'wallet' => $seller->wallet + $order->total,
                    'reputation' => $seller->reputation + 10,
                    'updated_by' => $userId,
                    'updated_at' => Carbon::now()
                ], $order->seller_id);
                $this->userRepository->save([
                    'reputation' => $buyer->reputation + 10,
                    'updated_by' => $userId,
                    'updated_at' => Carbon::now()
                ], $order->user_id);
                $this->handleUpdateOrder($request, $userId, $id);
                $this->updateFinishProduct($order->product_id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
            if ($request->status == 5) {
                $this->handleUpdateOrder($request, $userId, $id);
                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Cập nhật trạng thái đơn hàng thành công',
                ]);
            }
        } else {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái cập nhật không phù hợp!',
            ], 400);
        }


        // cập nhật status

        // return response()->json([
        //     'status' => 'Thành công',
        //     'message' => 'Cập nhật trạng thái đơn hàng thành công',
        // ]);
    }

    public function updateStatusByAdmin(Request $request ,$id)
    {
        // lấy order bằng ID
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $order = $this->orderRepository->getById($id);

        if ($order->status != 5 && $order->status != 6) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái cập nhật không phù hợp!',
            ], 400);
        }

        $buyer = $this->userRepository->getById($order->user_id);

        $this->userRepository->save([
            'wallet' => $buyer->wallet + $order->total,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $order->user_id);

        $this->orderRepository->save([
            'status' => 7,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $id);


        // cập nhật status

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Đã hoàn tiền xong',
        ]);
    }

    public function getAllOrders(Request $request)
    {
        $limit = $request->limit ?? 10;
        $orders = $this->orderRepository->getAll($limit);
        $data = [];
        $memberData = [];
        foreach ($orders as $order) {
            $product = $this->productRepository->getById($order->product_id);
            $memberData['id'] = $order->id;
            $memberData['created_date'] = Carbon::parse( $order->created_at)->format('d/m/Y');
            $memberData['buyer_id'] = $order->user_id;
            $memberData['seller_id'] = $order->seller_id;
            $memberData['product_name'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = $order->price;
            $memberData['quantity'] = $order->quantity;
            $memberData['total'] = $order->total;
            $memberData['status'] = $this->getStatus($order->status);
            array_push($data, $memberData);
        }

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_page' => $orders->lastPage(),
            'total_items' => count($orders),
            'total_in_all_page' => $orders->total()
        ]);
    }
}
