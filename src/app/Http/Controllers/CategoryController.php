<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Util\AppConstant;
use App\Util\ImageService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Util\AuthService;

class CategoryController extends Controller
{

    protected $categoryRepository;
    protected $orderRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository, OrderRepositoryInterface $orderRepository)
    {
        $this->categoryRepository = $categoryRepository;
        $this->orderRepository = $orderRepository;
    }

    public function index()
    {
        $categories = Category::all();
        $data = [];
        $memberData = [];
        foreach ($categories as $category) {
            $memberData['id'] = $category->id;
            $memberData['name'] = $category->name;
            $memberData['description'] = $category->description;
            $memberData['image'] = AppConstant::$DOMAIN . 'api/categories/' . $category->id . '/images';
            array_push($data, $memberData);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'get data sucesss',
            'data' => $data
        ]);
    }

    public function view($id)
    {
        $category = $this->categoryRepository->getById($id);
        if (!$category)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'not found category'
            ], 404);
        } else {
            $data = [];
            $data['id'] = $category->id;
            $data['name'] = $category->name;
            $data['description'] = $category->description;
            $data['image'] = AppConstant::$DOMAIN . 'api/categories/' . $category->id . '/images';
            return response()->json([
                'status' => 'success',
                'message' => 'found this category',
                'data' => $data
            ]);
        }
    }

    public function uploadImage(Request $request, $id){
        $message = ImageService::uploadImage($request, $id, AppConstant::$UPLOAD_DIRECTORY_CATEGORY_IMAGE, 'categories');

        if ($message == AppConstant::$UPLOAD_FAILURE) {
            $statusCode = 400;
        } else {
            $statusCode = 200;
        }

        return response()->json([
            'message' => $message
        ], $statusCode);
    }
    public function getImage($id){
        $category = $this->categoryRepository->getById($id);
        if ($category->image_id == null) {
            $imageData = file_get_contents(AppConstant::$CATEGORY_THUMBNAIL);
            header('Content-Type: image/jpeg');
            echo $imageData;
        } else {
            $path = ImageService::getPathImage($id, 'categories');
            if (str_contains($path, 'uploads')){
                header('Content-Type: image/jpeg');
                readfile($path);
            } else {
                return response()->json([
                    'message' => $path
                ]);
            }
        }
    }

    public function getStatisticByCategory($id) {
        $category = $this->categoryRepository->getById($id);
        $products = $category->products;
        $sold = count($this->orderRepository->getCompleteOrder());
        $tagTotal = 0;
        foreach ($products as $product) {
            $tagTotal = $tagTotal + DB::table('product_tags')->where('product_id', $product->id)->count();
        }
        return response()->json([
            'status' => 'success',
            'message'=> 'Lấy dữ liệu thành công',
            'data' => [
                'id' => $id,
                'total' => count($products),
                'sold' => $sold,
                'tag_total' => $tagTotal
            ]
        ]);
    }

    public function create(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $category = $this->categoryRepository->save([
            'name' => $request->name,
            'description' => $request->description ?? '',
            'created_at' => Carbon::now(),
            'created_by' => $userId,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId
        ]);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Tạo danh mục thành công',
            'data' => [
                'id' => $category->id
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);
        $category = $this->categoryRepository->getById($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $this->categoryRepository->save([
            'name' => $request->name ?? $category->name,
            'description' => $request->description ?? $category->description,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId
        ], $id);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Cập nhật danh mục thành công'
        ]);
    }

    public function delete($id, Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $this->categoryRepository->save([
            'deleted_at' => Carbon::now(),
            'deleted_by' => $userId
        ], $id);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Cập nhật danh mục thành công'
        ]);
    }
}
