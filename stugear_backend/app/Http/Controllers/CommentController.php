<?php

namespace App\Http\Controllers;

use App\Repositories\Comment\CommentRepositoryInterface;
use App\Repositories\Rating\RatingRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;
use Carbon\Carbon;
use App\Util\AppConstant;
use App\Util\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    protected $commentRepository;
    protected $userRepository;
    protected $ratingRepository;

    public function __construct(CommentRepositoryInterface $commentRepository,
        UserRepositoryInterface $userRepository,
        RatingRepositoryInterface $ratingRepository)
    {
        $this->commentRepository = $commentRepository;
        $this->userRepository = $userRepository;
        $this->ratingRepository = $ratingRepository;
    }

    public function getCommentByProductId(Request $request, $productId)
    {
        $limit = $request->limit ?? 5;
        Carbon::setLocale('vi');
        $comments = $this->commentRepository->getCommentWithParentIdZeroByProductId($productId, $limit);
        $data = [];
        $memberData = [];
        foreach ($comments as $comment) {
            if ($comment->parent_id != 0)
            {
                continue;
            }
            $ownerComment = $this->userRepository->getById($comment->owner_id);
            $memberData['id'] = $comment->id;
            $memberData['owner_name'] = $ownerComment->name;
            $memberData['owner_id'] = $comment->owner_id;
            $memberData['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $comment->owner_id . '/images';
            $memberData['content'] = $comment->content;
            $memberData['vote'] = $comment->vote;
            $memberData['rating'] = $comment->rating_id;
            if ($comment->reply_on != 0) {
                $user = $this->userRepository->getById($comment->reply_on);
                $memberData['reply_on'] = $user->name;
            } else {
                $memberData['reply_on'] = '';
            }
            $memberData['reply_on_id'] = $comment->reply_on;
            $memberData['last_updated'] = Carbon::parse($comment->updated_at)->diffForHumans(Carbon::now());
            $subCommentData = [];
            $subCommentMember = [];
            $subComments = $this->commentRepository->getCommentByParentId($comment->id);
            foreach ($subComments as $subComment) {
                $ownerSubComment = $this->userRepository->getById($subComment->owner_id);
                $subCommentMember['id'] = $subComment->id;
                $subCommentMember['owner_name'] = $ownerSubComment->name;
                $subCommentMember['owner_id'] = $subComment->owner_id;
                $subCommentMember['owner_image'] = AppConstant::$DOMAIN . 'api/users/' . $subComment->owner_id . '/images';
                $subCommentMember['content'] = $subComment->content;
                $subCommentMember['vote'] = $subComment->vote;
                if ($subComment->reply_on != 0) {
                    $user = $this->userRepository->getById($subComment->reply_on);
                    $subCommentMember['reply_on'] = $user->name;
                } else {
                    $subCommentMember['reply_on'] = '';
                }
                $subCommentMember['reply_on_id'] = $subComment->reply_on;
                $subCommentMember['last_updated'] = Carbon::parse($subComment->updated_at)->diffForHumans(Carbon::now());
                array_push($subCommentData, $subCommentMember);
            }
            $memberData['sub_comment'] = $subCommentData;
            array_push($data, $memberData);
        }

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_page' => $comments->lastPage(),
            'total_items' => count($comments)
        ]);
    }

    public function create(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|min:1',
            'parent_id' => 'required|integer|min:0',
            'reply_on' => 'required|integer|min:0',
            'rating' => 'required|integer|between:0,5'
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        if ($request->content == '') {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Nội dung comment không thể rỗng'
            ], 400);
        }

        if ($request->parent_id != 0 && $request->rating != 0) {
            return response()->json([
                'status'=> 'Lỗi',
                'message' => 'Khi reply không được rating'
            ], 400);
        }

        if ($request->parent_id == 0 && $request->rating == 0) {
            return response()->json([
                'status'=> 'Lỗi',
                'message' => 'Khi comment phải rating, chỉ reply comment là không rating!'
            ], 400);
        }

        $this->ratingRepository->rating($request->product_id, $request->rating, $userId);

        $result = $this->commentRepository->save([
            'content' => $request->input('content'),
            'owner_id' => $userId,
            'parent_id' => $request->input('parent_id'),
            'product_id' => $request->input('product_id'),
            'reply_on' => $request->input('reply_on'),
            'vote' => 0,
            'rating_id' => $request->input('rating'),
            'created_by' => $userId,
            'updated_by' => $userId,
            'created_at' => Carbon::now(),
            'updated_at'=> Carbon::now()
        ]);

        if ($result) {
            return response()->json([
                'status'=> 'Thành công',
                'message' => 'Comment thành công',
            ]);
        } else {
            return response()->json([
                'status'=> 'Thất bại',
                'message' => 'Comment thất bại',
            ],400);
        }

    }

    public function update(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $validator = Validator::make($request->all(), [
            'content' => 'required',
            'reply_on' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        if ($request->content == '') {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Nội dung comment không thể rỗng'
            ], 400);
        }

        $comment = $this->commentRepository->getById($id);
        if ($comment->owner_id != $userId) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Không thể chỉnh sửa comment của người dùng khác'
            ], 400);
        }

        $result = $this->commentRepository->save([
            'reply_on' => $request->reply_on ?? $comment->reply_on,
            'content'=> $request->content,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $comment->id);

        if ($result) {
            return response()->json([
                'status'=> 'Thành công',
                'message' => 'Comment thành công',
            ]);
        } else {
            return response()->json([
                'status'=> 'Thất bại',
                'message' => 'Comment thất bại',
            ],400);
        }
    }

    public function vote(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'vote' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $voteSymbol = ['+', '-'];


        if (!in_array($request->vote, $voteSymbol))
        {
            return response()->json([
                'status'=> 'Lỗi',
                'message' => 'Vote không được',
            ], 400);
        }

        $comment = $this->commentRepository->getById($id);
        $oldVote = $comment->vote;

        if ($request->vote == '+') {
            $comment->increment('vote');
        }

        if ($request->vote == '-') {
            $comment->decrement('vote');
        }

        $comment = $this->commentRepository->getById($id);
        $newVote = $comment->vote;

        if ($oldVote != $newVote)
        {
            return response()->json([
                'status'=> 'Thành công',
                'message'=> 'Vote thành công',
            ]);
        } else {
            return response()->json([
                'status'=> 'Thất bại',
                'message'=> 'Vote thất bại'
            ]);
        }
    }
}
