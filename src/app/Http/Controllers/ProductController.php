<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\Comment\CommentRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\Tag\TagRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;
use App\Util\AuthService;
use App\Util\ImageService;
use Illuminate\Http\Request;
use App\Util\AppConstant;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class ProductController extends Controller
{
    protected $productRepository;
    protected $categoryRepository;
    protected $tagRepository;
    protected $userRepository;
    protected $commentRepository;

    public function __construct(ProductRepositoryInterface $productRepository,
        CategoryRepositoryInterface $categoryRepository,
        TagRepositoryInterface $tagRepository,
        UserRepositoryInterface $userRepository,
        CommentRepositoryInterface $commentRepository)
    {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
        $this->tagRepository = $tagRepository;
        $this->userRepository = $userRepository;
        $this->commentRepository = $commentRepository;
    }

    public function index(Request $request)
    {
        $limit = $request->limit ?? 10;
        $products = $this->productRepository->getAll($limit);
        $data = [];
        $memberData = [];
        foreach ($products as $product) {
            $memberData['id'] = $product->id;
            $memberData['title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = number_format($product->price) . ' VNĐ';
            $memberData['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $memberData['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $memberData['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 100000000));
            $productTags = $product->productTags;
            $tags = [];
            foreach ($productTags as $productTag) {
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $productTag->tag->name;
                $tagMember['color'] = $productTag->tag->color;
                array_push($tags, $tagMember);
            }
            $memberData['tags'] = $tags;
            $memberData['description'] = $product->description ?? '';
            $memberData['status'] = $product->status;
            $memberData['brand'] = $product->brand ?? '';
            $memberData['last_updated'] = $product->updated_at ?? '';
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user->id . '/images';;
            array_push($data, $memberData);
        }

        return response()->json([
            'status'=> 'success',
            'message'=> 'Lấy dữ liệu thành công',
            'data'=> $data,
            'page' => $request->page,
            'total_page' => $products->lastPage(),
            'total_items' => count($products)
        ]);
    }
    public function view($id)
    {
        $product = $this->productRepository->getById($id);
        if (!$product)
        {
            return response()->json([
            'status' => 'error',
                'message' => 'not found product'
            ], 404);
        } else {
            $data = [];
            $data['id'] = $product->id;
            $data['title'] = $product->name;
            $data['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $data['price'] = number_format($product->price) . ' VNĐ';
            $data['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $data['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $data['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 10000000));
            $productTags = $product->productTags;
            $tags = [];
            $count = 0;
            foreach ($productTags as $productTag) {
                if ($count == 3) break;
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $productTag->tag->name;
                $tagMember['color'] = $productTag->tag->color;
                array_push($tags, $tagMember);
                $count++;
            }
            $data['tags'] = $tags;
            $data['description'] = $product->description ?? '';
            $data['status'] = $product->status;
            $data['brand'] = $product->brand ?? '';
            $data['last_updated'] = $product->updated_at ?? '';
            $data['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user->id . '/images';;
            $data['owner_name'] = $product->user->name;
            $data['owner_id'] = $product->user->id;
            $data['quantity'] = $product->quantity;
            $data['transaction_method'] = $product->transaction_id == 1 ? 'Trực tiếp' : 'Trên trang web';
            return response()->json([
                'status'=> 'success',
                'message'=> 'Lấy dữ liệu thành công',
                'data'=> $data
            ]);
        }
    }

    public function uploadImage(Request $request, $id){
        $message = ImageService::uploadImage($request, $id, AppConstant::$UPLOAD_DIRECTORY_PRODUCT_IMAGE, 'products');

        if ($message == AppConstant::$UPLOAD_FAILURE) {
            $statusCode = 400;
        } else if ($message == 'Lỗi không có ảnh') {
            $statusCode = 400;
        } else {
            $statusCode = 200;
        }

        return response()->json([
            'message' => $message
        ], $statusCode);
    }
    public function getImage($id) {
        $product = $this->productRepository->getById($id);
        if ($product->image_id == null) {
            $imageData = file_get_contents(AppConstant::$PRODUCT_THUMBNAIL);
            header('Content-Type: image/jpeg');
            echo $imageData;
        } else {
            $path = ImageService::getPathImage($id, 'products');
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

    public function searchByName(Request $request) {
        $products = $this->productRepository->searchByName($request->q);
        return response()->json([
            'status' => 'success',
            'message' => 'found this product',
            'data' => $products,
            'count' => count($products)
        ]);

    }

    public function getProductByCategoryId(Request $request, $id) {
        $limit = $request->limit ?? 10;
        $products = $this->productRepository->getProductByCategoryId($id, $limit);
        $data = [];
        $memberData = [];
        foreach ($products as $product) {
            $memberData['id'] = $product->id;
            $memberData['title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = number_format($product->price) . ' VNĐ';
            $memberData['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $memberData['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $memberData['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 100000000));
            $productTags = $this->productRepository->getProductTagsByProductId( $product->id );
            $tags = [];
            $count = 0;
            foreach ($productTags as $productTag) {
                if ($count == 3) break;
                $tag = $this->tagRepository->getById($productTag->tag_id);
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $tag->name;
                $tagMember['color'] = $tag->color;
                array_push($tags, $tagMember);
                $count++;
            }
            $memberData['tags'] = $tags;
            $memberData['description'] = $product->description ?? '';
            $result = '';
            switch ($product->status) {
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
            $memberData['status'] = $result;
            $memberData['brand'] = $product->brand ?? '';
            $memberData['last_updated'] = Carbon::parse($product->updated_at)->format('d/m/Y');
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user_id . '/images';;
            array_push($data, $memberData);
        }
        return response()->json([
            'status'=> 'success',
            'message'=> 'Lấy dữ liệu thành công',
            'data'=> $data,
            'page' => $request->page,
            'total_page' => $products->lastPage(),
            'total_items' => count($products)
        ]);
    }

    public function getProductByTagId(Request $request, $id)
    {
        $limit = $request->limit ?? 10;
        $productTags = $this->tagRepository->getProductTagsByTagId( $id, $limit );
        $total_page = $productTags->lastPage();
        $total_items = count($productTags);
        $products = [];
        foreach ($productTags as $productTag) {
            $product = $this->productRepository->getById( $productTag->product_id );
            if ($product->status == 1 || $product->status == 0 || $product->status == 5) {
                continue;
            }
            array_push($products, $product);
        }
        $data = [];
        $memberData = [];
        foreach ($products as $product) {
            $memberData['id'] = $product->id;
            $memberData['title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = number_format($product->price) . ' VNĐ';
            $memberData['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $memberData['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $memberData['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 10000000));
            $productTags = $product->productTags;
            $tags = [];
            foreach ($productTags as $productTag) {
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $productTag->tag->name;
                $tagMember['color'] = $productTag->tag->color;
                array_push($tags, $tagMember);
            }
            $memberData['tags'] = $tags;
            $memberData['description'] = $product->description ?? '';
            $result = '';
            switch ($product->status) {
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
            $memberData['status'] = $result;
            $memberData['brand'] = $product->brand ?? '';
            $memberData['last_updated'] = $product->updated_at ?? '';
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user->id . '/images';;
            $memberData['owner_name'] = $product->user->name;
            $memberData['owner_id'] = $product->user->id;
            $memberData['quantity'] = $product->quantity;
            $memberData['transaction_method'] = $product->transaction_id == 0 ? 'Trực tiếp' : 'Trên trang web';
            array_push($data, $memberData);
        }
        return response()->json([
            'status'=> 'success',
            'message'=> 'Lấy dữ liệu thành công',
            'data'=> $data,
            'page' => $request->page,
            'total_page' => $total_page,
            'total_items' => $total_items
        ]);
    }

    public function getByCriteria(Request $request)
    {
        if ($request->transaction_method == 'cash')
        {
            $transaction_method = [1];
        } else if ($request->transaction_method == 'online') {
            $transaction_method = [2];
        } else {
            $transaction_method = [1,2];
        }
        $sort = [];
        if ($request->field == 'lastUpdate' && $request->sort == 'increase')
        {
            $filter = ['field' => 'updated_at', 'sort' => 'ASC'];
        }
        if ($request->field == 'lastUpdate' && $request->sort == 'decrease')
        {
            $filter = ['field' => 'updated_at', 'sort' => 'DESC'];
        }
        if ($request->field == 'price' && $request->sort == 'increase')
        {
            $filter = ['field' => 'price', 'sort' => 'ASC'];
        }
        if ($request->field == 'price' && $request->sort == 'decrease')
        {
            $filter = ['field' => 'price', 'sort' => 'DESC'];
        }
        $products = Product::whereIn('transaction_id', $transaction_method)->orderBy($filter['field'],$filter['sort'])->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $products
        ]);
    }

    public function searchInCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $query = Product::query();
        if ($request->transaction_method == 'cash')
        {
            $transaction_method = [1];
        } else if ($request->transaction_method == 'online') {
            $transaction_method = [2];
        } else {
            $transaction_method = [1,2];
        }
        $sort = [];
        if ($request->field == 'lastUpdate' && $request->sort == 'increase')
        {
            $filter = ['field' => 'updated_at', 'sort' => 'ASC'];
        }
        if ($request->field == 'lastUpdate' && $request->sort == 'decrease')
        {
            $filter = ['field' => 'updated_at', 'sort' => 'DESC'];
        }
        if ($request->field == 'price' && $request->sort == 'increase')
        {
            $filter = ['field' => 'price', 'sort' => 'ASC'];
        }
        if ($request->field == 'price' && $request->sort == 'decrease')
        {
            $filter = ['field' => 'price', 'sort' => 'DESC'];
        }
        $query->join('users','users.id','=','products.user_id');
            $query->whereIn('products.transaction_id', $transaction_method);
        if (isset($filter['field']) && isset($filter['sort'])) {
            $query->orderBy($filter['field'],$filter['sort']);
        }

            $query->whereNotIn('products.status', [0, 1, 2, 5]);
            $query->select('products.id', 'products.price', 'products.image_id',
                'products.status', 'products.description', 'products.brand',
                'products.transaction_id','products.updated_at', 'products.condition',
                'products.user_id', 'products.quantity', 'products.name','products.category_id');
            $query->where('products.category_id', $request->category_id);
            $query->where(function($q) use ($request) {
                $q->where('products.name', 'LIKE', '%' . $request->q . '%')
                    ->orWhere('users.name', 'LIKE', '%' . $request->q . '%');
            });
        $query->whereNull('products.deleted_by');
        $query->whereNull('products.deleted_at');
        $limit = $request->limit ?? 10;
        $products = $query->paginate($limit);
        $data = [];
        $memberData = [];
        $countProductPerPage = 0;
        foreach ($products as $product) {
            $countProductPerPage++;
            $memberData['id'] = $product->id;
            $memberData['category'] = $product->category_id;
            $memberData['title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = number_format($product->price) . ' VNĐ';
            $memberData['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $memberData['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $memberData['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 100000000));
            $productTags = $this->productRepository->getProductTagsByProductId( $product->id );
            $tags = [];
            $count = 0;
            foreach ($productTags as $productTag) {
                if ($count == 3) break;
                $tag = $this->tagRepository->getById($productTag->tag_id);
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $tag->name;
                $tagMember['color'] = $tag->color;
                array_push($tags, $tagMember);
                $count++;
            }
            $memberData['tags'] = $tags;
            $memberData['description'] = $product->description ?? '';
            $memberData['status'] = $product->status;
            $memberData['brand'] = $product->brand ?? '';
            $memberData['last_updated'] = $product->updated_at;
            $user = $this->userRepository->getById($product->user_id);
            $memberData['owner_name'] = $user->name;
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user_id . '/images';;
            array_push($data, $memberData);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_items' => $countProductPerPage,
            'total_pages' => $products->lastPage(),
            'total_in_all_page' => $products->total()
        ]);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'price' => 'required|integer|min:1',
            'condition' => 'required|in:1,2',
            'status' => 'required|integer',
            'origin_price' => 'required|integer|min:1',
            'quantity' => 'required|integer|min:1',
            'category_id' => 'required|integer|min:1',
            'transaction_id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $user = $this->userRepository->getById($userId);
        if ($user->reputation < 0) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không cho phép tạo sản phẩm vì uy tín thấp!'
            ],400);
        }

        $role = DB::table('user_roles')
        ->where('user_id', $userId)
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();

        if (in_array('USER', $role) && ($request->status == 0 || $request->status == 3 || $request->status == 5)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không cho phép người dùng tạo sản phẩm trong các trạng thái này'
            ],400);
        }

        $data = [
            'name' => $request->name,
            'price' => $request->price,
            'condition' => strval($request->condition),
            'edition' => $request->edition,
            'status' => $request->status,
            'brand' => $request->brand ?? '',
            'origin_price' => $request->origin_price,
            'quantity' => $request->quantity,
            'user_id' => $userId,
            'category_id' => $request->category_id,
            'transaction_id' => $request->transaction_id,
            'description' => $request->description ?? '',
            'created_at' => Carbon::now(),
            'created_by' => $userId,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId,
        ];
        $product = $this->productRepository->save($data);

        for ($i = 1; $i<=5; $i++) {
            DB::table('rating_products')->insert([
                'product_id'=> $product->id,
                'rating_id' => $i,
                'quantity' => 0,
                'created_at' => Carbon::now(),
                'created_by' => $userId,
                'updated_at' => Carbon::now(),
                'updated_by' => $userId
            ]);
        }

        if (!$product) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Tạo sản phẩm thất bại',
            ], 400);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'Tạo sản phẩm thành công',
                'data' => $product
            ]);
        }
    }

    public function createDraft(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $role = DB::table('user_roles')
        ->where('user_id', $userId)
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();

        if ($request->price < 0 && $request->price!=null) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Lỗi price nhỏ hơn 0'
            ], 400);
        }

        if (!in_array($request->condition, [0,1]) && $request->condition != null) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Condition không đúng định dạng'
            ], 400);
        }

        if ($request->origin_price < 0 && $request->price!=null) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Lỗi origin_price nhỏ hơn 0'
            ], 400);
        }

        if ($request->category_id < 0 && $request->category_id!=null) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Lỗi category_id nhỏ hơn 0'
            ], 400);
        }


        if ($request->transaction_id < 0 && $request->transaction_id!=null) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Lỗi transaction_id nhỏ hơn 0'
            ], 400);
        }

        $data = [
            'name' => $request->name ?? '',
            'price' => $request->price ?? 0,
            'condition' => $request->condition != null ? strval($request->condition) : "0",
            'edition' => $request->edition ?? '',
            'status' => 1,
            'brand' => $request->brand ?? '',
            'origin_price' => $request->origin_price ?? 0,
            'quantity' => $request->quantity ?? 0,
            'user_id' => $userId,
            'category_id' => $request->category_id ?? 1,
            'transaction_id' => $request->transaction_id ?? 1,
            'description' => $request->description ?? '',
            'created_at' => Carbon::now(),
            'created_by' => $userId,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId,
        ];
        $product = $this->productRepository->save($data);

        for ($i = 1; $i<=5; $i++) {
            DB::table('rating_products')->insert([
                'product_id'=> $product->id,
                'rating_id' => $i,
                'quantity' => 0,
                'created_at' => Carbon::now(),
                'created_by' => $userId,
                'updated_at' => Carbon::now(),
                'updated_by' => $userId
            ]);
        }

        if (!$product) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Tạo sản phẩm thất bại',
            ], 400);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'Tạo sản phẩm thành công',
                'data' => $product
            ]);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required',
        ]);

        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }
        $role = DB::table('user_roles')
        ->where('user_id', $userId)
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();

        if (in_array('USER', $role) && ($request->status == 0 || $request->status == 3 || $request->status == 5)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không cho phép người dùng tự duyệt sản phẩm trong các trạng thái này'
            ], 400);
        }
        $this->productRepository->save(['status' => strval($request->status)], $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái sản phẩm thành công',
            'data' => $this->productRepository->getById($id)
        ]);
    }

    public function getProductByCurrentUser(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $limit = $request->limit ?? 10;

        $products = $this->productRepository->getProductByCurrentUser($userId, $limit);
        $data = [];
        $memberData = [];
        foreach ($products as $product) {
            $memberData['id'] = $product->id;
            $memberData['title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = number_format($product->price) . ' VNĐ';
            $memberData['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $memberData['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $memberData['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 100000000));
            $productTags = $this->productRepository->getProductTagsByProductId( $product->id );
            $tags = [];
            $count = 0;
            foreach ($productTags as $productTag) {
                if ($count == 3) break;
                $tag = $this->tagRepository->getById($productTag->tag_id);
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $tag->name;
                $tagMember['color'] = $tag->color;
                array_push($tags, $tagMember);
                $count++;
            }
            $memberData['tags'] = $tags;
            $memberData['description'] = $product->description;
            $result = '';
            switch ($product->status) {
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
            $memberData['status'] = $result;
            $memberData['brand'] = $product->brand;
            $memberData['last_updated'] = Carbon::parse($product->updated_at)->format('d/m/Y');
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user_id . '/images';;
            array_push($data, $memberData);
        }

        return response()->json([
            'status'=> 'success',
            'message'=> 'Lấy dữ liệu thành công',
            'data'=> $data,
            'page' => $request->page ?? 1,
            'total_page' => $products->lastPage(),
            'total_items' => count($products)
        ]);
    }

    public function attachTag(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $product = $this->productRepository->getById($id);

        $role = DB::table('user_roles')
        ->where('user_id', $userId)
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();

        $tags = $request->tags;

        foreach ($tags as $tag) {
            if (!is_int($tag) || $tag < 1) {
                return response()->json([
                    'status'=> 'Lỗi',
                    'message'=> 'Mã tag không đúng'
                ], 400);
            }
        }

        if (in_array('USER', $role) && $userId != $product->user_id) {
            return response()->json([
                'status'=> 'error',
                'message'=> 'Không được phép đính tag cho sản phẩm của user khác, hãy là chủ sở hữu hoặc admin!',
            ], 400);
        }

        $result = $this->productRepository->attachTag($id, $request->tags, $userId);

        return response()->json([
            'status'=> 'success',
            'message'=> 'Gắn tag thành công',
        ]);
    }

    public function getAllStatusProduct()
    {
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => AppConstant::$STATUS_PRODUCT
        ]);
    }

    public function getAllTransactionMethod()
    {
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data'=> AppConstant::$TRANSACTION_METHOD
        ]);

    }

    public function updateProduct(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $product = $this->productRepository->getById($id);
        if ($product->user_id != $userId) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Không thể chỉnh sửa sản phẩm của người dùng khác',
            ]);
        }

        if ($product->status != 1) {
            $validator = Validator::make($request->all(), [
                'name' => 'string',
                'price' => 'integer|min:1',
                'condition' => 'in:1,2',
                'origin_price' => 'integer|min:1',
                'status' => 'required|integer|min:0',
                'quantity' => 'integer|min:1',
                'category_id' => 'integer|min:1',
                'transaction_id' => 'integer|min:1',
            ]);

            if ($validator->fails()) {
                 return response()->json(['error' => $validator->errors()], 400);
            }
        }

        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $role = DB::table('user_roles')
        ->where('user_id', $userId)
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();

        if (in_array('USER', $role) && ($request->status == 0 || $request->status == 3 || $request->status == 5)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không cho phép người dùng tự duyệt sản phẩm trong các trạng thái này'
            ], 400);
        }

        $data = [
            'name' => $request->name ?? $product->name,
            'price' => $request->price ?? $product->getRawOriginal('price'),
            'condition' => $request->condition ? strval($request->condition) : $product->condition,
            'edition' => $request->edition ?? $product->edition,
            'brand' => $request->brand ?? $product->brand,
            'origin_price' => $request->origin_price ?? $product->origin_price,
            'quantity' => $request->quantity ?? $product->quantity,
            'category_id' => $request->category_id ?? $product->category_id,
            'transaction_id' => $request->transaction_id ?? $product->transaction_id,
            'description' => $request->description ?? $product->description,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId,
        ];

        $product = $this->productRepository->save($data, $id);

        if (!$product) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Cập nhật sản phẩm thất bại',
            ], 400);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật sản phẩm thành công',
            ]);
        }
    }

    public function delete(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $role = DB::table('user_roles')
        ->where('user_id', $userId)
        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
        ->pluck('roles.role_name')
        ->toArray();

        $product = $this->productRepository->getById($id);
        if (!$product || $product->deleted_at != null || $product->deleted_by != null) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Không tìm thấy sản phẩm này để xóa!',
            ], 400);
        }

        if ($product->user_id != $userId && in_array('USER', $role)) {
            return response()->json([
                'status'=> 'Lỗi',
                'message'=> 'Không thể xóa sản phẩm của người khác trừ khi là Admin!',
            ]);
        }

        $this->productRepository->save([
            'deleted_at' => Carbon::now(),
            'deleted_by' => $userId
        ], $id);

        return response()->json([
            'status'=> 'Thành công',
            'message'=> 'Xóa sản phẩm thành công'
        ]);
    }

    public function searchWithCriteria(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'category_id' => 'array',
        //     'status' => 'integer',
        //     'price_from' => 'required',
        //     'price_to' => 'required',
        //     'date_from' => 'date',
        //     'date_to' => 'date',
        //     'transaction_method' => 'array',
        //     'tags' => 'array',
        //     'condition' => 'array'
        // ]);

        // if ($validator->fails()) {
        //      return response()->json(['error' => $validator->errors()], 400);
        // }

        if ($request->price_from != "") {
            if (!is_numeric($request->price_from)) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Price from phải là số'
                ], 400);
            }
        }

        if ($request->price_to != "") {
            if (!is_numeric($request->price_to)) {
                return response()->json([
                    'status' => 'Lỗi',
                    'message' => 'Price to phải là số'
                ], 400);
            }
        }

        // NHỚ VALIDATE LẠI KHI CÓ TIME, DATEFROM, DATETO, ... MỚ Ở TRÊN
        // if ($request->date_from != "") {
        //     // dd(111);
        //     if (!strtotime($request->date_from)) {
        //         return response()->json([
        //             'status' => 'Lỗi',
        //             'message' => 'Date from phải là kiểu date'
        //         ], 400);
        //     }
        // }

        // if ($request->date_to != "") {
        //     if (!date_parse($request->date_to)) {
        //         return response()->json([
        //             'status' => 'Lỗi',
        //             'message' => 'Date to phải là kiểu date'
        //         ], 400);
        //     }
        // }


        $limit = $request->limit ?? 9;
        $products = $this->productRepository->searchWithCriteria($request, $limit);

        if ($products == 'condition') {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không tồn tại tình trạng sản phẩm này'
            ], 400);
        }

        if ($products == 'transaction_method') {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không tồn tại phương thức giao dịch này'
            ], 400);
        }

        if ($products == 'status') {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không tồn tại trạng thái sản phẩm này'
            ], 400);
        }

        $data = [];
        $memberData = [];
        foreach ($products as $product) {
            $memberData['id'] = $product->id;
            $memberData['title'] = $product->name;
            $memberData['product_image'] = AppConstant::$DOMAIN . 'api/products/' . $product->id . '/images';
            $memberData['price'] = number_format($product->price) . ' VNĐ';
            $memberData['condition'] = $product->condition == 1 ? 'Cũ' : 'Mới';
            $memberData['origin_price'] =  number_format($product->origin_price) . ' VNĐ';
            $memberData['comment_count'] = count($this->commentRepository->getCommentByProductId($product->id, 100000000));
            $productTags = $this->productRepository->getProductTagsByProductId( $product->id );
            $tags = [];
            $count = 0;
            foreach ($productTags as $productTag) {
                if ($count == 3) break;
                $tag = $this->tagRepository->getById($productTag->tag_id);
                $tagMember['id'] = $productTag->tag_id;
                $tagMember['name'] = $tag->name;
                $tagMember['color'] = $tag->color;
                array_push($tags, $tagMember);
                $count++;
            }
            $memberData['tags'] = $tags;
            $memberData['description'] = $product->description ?? '';
            $memberData['status'] = $product->status;
            $memberData['brand'] = $product->brand ?? '';
            $memberData['last_updated'] = $product->updated_at;
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $product->user_id . '/images';;
            array_push($data, $memberData);
        }

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_page' => $products->lastPage(),
            'total_items' => count($products),
            'total_in_all_page' => $products->total()
        ]);
    }
}
