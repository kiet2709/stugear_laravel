<?php

namespace App\Http\Controllers;

use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;
use App\Repositories\Wishlist\WishlistRepositoryInterface;
use App\Util\AppConstant;
use App\Util\AuthService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    protected $wishlistRepository;
    protected $productRepository;
    protected $userRepository;

    public function __construct(WishlistRepositoryInterface $wishlistRepository,
        ProductRepositoryInterface $productRepository,
        UserRepositoryInterface $userRepository)
    {
        $this->wishlistRepository = $wishlistRepository;
        $this->productRepository = $productRepository;
        $this->userRepository = $userRepository;
    }

    public function getWishlistByUserId(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);
        $limit = 10;
        $wishlist_products = $this->wishlistRepository->getWishlistByUserId($userId, $limit);
        $data = [];
        $memberData = [];
        foreach ($wishlist_products as $wishlist_product) {
            if ($wishlist_product->deleted_by != null || $wishlist_product->deleted_at != null) {
                continue;
            }
            $product = $this->productRepository->getById($wishlist_product->product_id);
            $memberData['id'] = $wishlist_product->product_id;
            $memberData['name'] = $product->name;
            $memberData['price'] = $product->price;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['status'] = $product->status;
            array_push($data, $memberData);
        }
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy wishlist thành công',
            'data' => $data
        ]);
    }

    public function addProductToWishlist(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $product = $this->productRepository->getById($request->product_id);
        if (! $product || $product->deleted_at != null || $product->deleted_by != null) {
            return response()->json([
                'error'=> 'Có lỗi',
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $wishlist_products = $this->wishlistRepository->getWishlistByUserId($userId, 100000);
        $wishlistId = $this->wishlistRepository->getWishlistIdByUserId($userId);

        foreach ($wishlist_products as $wishlist_product) {
            $product = $this->productRepository->getById($wishlist_product->product_id);
            if ($wishlist_product->product_id == $request->product_id && ($wishlist_product->deleted_at == null || $wishlist_product->deleted_by == null)) {
                return response()->json([
                    'fail'=> 'Thất bại',
                    'message'=> 'Không thể thêm sản phẩm vào nữa vì đã thêm rồi!'
                ], 500);
            } else if ($wishlist_product->product_id == $request->product_id && ($wishlist_product->deleted_at != null || $wishlist_product->deleted_by != null)){
                $result = $this->wishlistRepository->updateWishlist([
                    'updated_by' => $userId,
                    'updated_at'=> Carbon::now(),
                    'deleted_by' => null,
                    'deleted_at' => null
                ], $request->product_id, $wishlistId);
                if ($result) {
                    return response()->json([
                        'success'=> 'Thành công',
                        'message'=> 'Thêm sản phẩm vào wishlist thành công'
                    ]);
                } else {
                    return response()->json([
                        'fail'=> 'Thất bại',
                        'message'=> 'Thêm sản phẩm vào wishlist thất bại'
                    ], 500);
                }
            }
        }
        $result = $this->wishlistRepository->addToWishlist([
            'wishlist_id'=> $wishlistId,
            'product_id'=> $request->product_id,
            'created_by' => $userId,
            'updated_by' => $userId,
            'created_at' => Carbon::now(),
            'updated_at'=> Carbon::now()
        ]);
        if ($result) {
            return response()->json([
                'success'=> 'Thành công',
                'message'=> 'Thêm sản phẩm vào wishlist thành công'
            ]);
        } else {
            return response()->json([
                'fail'=> 'Thất bại',
                'message'=> 'Thêm sản phẩm vào wishlist thất bại'
            ], 500);
        }
    }
    public function remove(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $product = $this->productRepository->getById($request->product_id);
        if (! $product || $product->deleted_at != null || $product->deleted_by != null) {
            return response()->json([
                'error'=> 'Có lỗi',
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $wishlish = $this->wishlistRepository->getById($userId);
        $wishlist_product = $this->wishlistRepository->getWishlistByIdAndProductId($userId, $request->product_id);
        if (! $wishlist_product || $wishlist_product->deleted_at != null || $wishlist_product->deleted_by != null){
            return response()->json([
                'error'=> 'Có lỗi',
                'message' => 'Sản phẩm này không có trong wishlish này để xóa!'
            ], 404);
        }

        $result = $this->wishlistRepository->updateWishlist([
            'updated_by' => $wishlish->user_id,
            'updated_at'=> Carbon::now(),
            'deleted_by' => $wishlish->user_id,
            'deleted_at' => Carbon::now()
        ], $request->product_id, $userId);

        if ($result) {
            return response()->json([
                'success'=> 'Thành công',
                'message'=> 'Xóa khỏi wishlist thành công'
            ]);
        } else {
            return response()->json([
                'fail'=> 'Thất bại',
                'message'=> 'Xóa khỏi wishlist thất bại'
            ], 500);
        }
    }
}
