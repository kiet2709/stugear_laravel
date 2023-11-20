<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Util\AppConstant;
use App\Util\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{

    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
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
        $data = [];
        $data['id'] = $category->id;
        $data['name'] = $category->name;
        $data['description'] = $category->description;
        $data['image'] = AppConstant::$DOMAIN . 'api/categories/' . $category->id . '/images';
        if (!$category)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'not found category'
            ], 404);
        } else {
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
        $sold = $products->where('condition', 0)->count();
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

    }
}
