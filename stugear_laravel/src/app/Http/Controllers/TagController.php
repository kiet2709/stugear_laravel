<?php

namespace App\Http\Controllers;

use App\Repositories\Tag\TagRepositoryInterface;
use App\Util\AuthService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    protected $tagRepository;


    public function __construct(TagRepositoryInterface $tagRepository)
    {
        $this->tagRepository = $tagRepository;
    }
    public function create(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $colors = [
            'bg-primary',
            'bg-secondary',
            'bg-success',
            'bg-danger',
            'bg-warning',
            'bg-info',
            'bg-light',
            'bg-dark',
            'bg-white'
        ];

        $tagNames = $request->names;
        $tagIDs = [];
        foreach ($tagNames as $tagName) {
            $tag = $this->tagRepository->findByTagName($tagName);

            if ($tag) {
                $tagIDs[] = $tag->id;
            } else {
                $tagID = $this->tagRepository->save([
                    'name' => $tagName,
                    'color'=> $colors[array_rand($colors)],
                    'created_by' => $userId,
                    'updated_by' => $userId,
                    'created_at' => Carbon::now(),
                    'updated_at'=> Carbon::now()
                ]);
                $tagIDs[] = $tagID->id;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo tag thành công',
            'data' => $tagIDs
        ]);
    }

    public function view($id)
    {
        $tag = $this->tagRepository->getById($id);
        if (!$tag) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Lấy dữ liệu tag thất bại',
            ]);
        } else {
            return response()->json([
                'status' => 'success',
                'message' => 'Lấy dữ liệu tag thành công',
                'data' => $tag
            ]);
        }
    }

    public function index(Request $request)
    {
        $tags = $this->tagRepository->getAll($request->limit ?? 100);
        $data = [];
        $memberData = [];
        foreach ($tags as $tag) {
            $memberData['id'] = $tag->id;
            $memberData['name'] = $tag->name;
            $memberData['color'] = $tag->color;
            array_push($data, $memberData);
        }
        return response()->json([
            'status'=> 'Thành công',
            'message'=> 'Lấy dữ liệu thành công',
            'data'=> $data,
            'page' => $request->page ?? 1,
            'total_page' => $tags->lastPage(),
            'total_items' => count($tags)
        ]);
    }
}
