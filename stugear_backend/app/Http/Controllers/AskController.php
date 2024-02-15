<?php

namespace App\Http\Controllers;

use App\Repositories\Ask\AskRepositoryInterface;
use Illuminate\Http\Request;
use App\Util\ImageService;
use App\Util\AppConstant;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Util\AuthService;
use Carbon\Carbon;

class AskController extends Controller
{
    protected $userRepository;
    protected $orderRepository;
    protected $productRepository;
    protected $askRepository;

    public function __construct(UserRepositoryInterface $userRepository,
        OrderRepositoryInterface $orderRepository,
        ProductRepositoryInterface $productRepository,
        AskRepositoryInterface $askRepository)
    {
        $this->userRepository = $userRepository;
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->askRepository = $askRepository;
    }

    public function uploadImage(Request $request, $id){
        $message = ImageService::uploadImage($request, $id, AppConstant::$UPLOAD_DIRECTORY_ASK_IMAGE, 'asks');

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
        $ask = $this->askRepository->getById($id);
        if ($ask->image_id == null) {
            $imageData = file_get_contents(AppConstant::$ASK_THUMBNAIL);
            header('Content-Type: image/jpeg');
            echo $imageData;
        } else {
            $path = ImageService::getPathImage($id, 'asks');
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

    public function withdraw(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $user = $this->userRepository->getById($userId);

        if ($request->amount <= 0) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Số tiền rút phải lớn 0!'
            ], 400);
        }

        if ($request->amount > $user->wallet) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Số tiền rút phải nhỏ hơn hoặc bằng số tiền bạn có!'
            ], 400);
        }

        $ask = $this->askRepository->save([
            'type' => 1,
            'description' => 'Số tiền cần rút: ' . $request->amount . '. ' . $request->description,
            'amount' => $request->amount,
            'owner_id' => $userId,
            'created_by' => $userId,
            'created_at' => Carbon::now()
        ]);

        $this->userRepository->save([
            'wallet' => $user->wallet - $request->amount,
            'updated_by' => $userId,
            'updated_at' => Carbon::now()
        ], $userId);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Tạo yêu cầu rút tiền thành công',
            'data' => [
                'ask_id' => $ask->id
            ]
        ]);
    }

    public function handleWithdraw(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        if ($request->status != 2 && $request->status != 3) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái không phù hợp!'
            ], 400);
        }

        $ask = $this->askRepository->getById($id);
        $userWithdraw = $this->userRepository->getById($ask->owner_id);

        if ($request->status == 3) {
            $this->userRepository->save([
                'wallet' => $userWithdraw->wallet + $ask->amount,
                'updated_by' => $userId,
                'updated_at' => Carbon::now()
            ], $userWithdraw->id);
        }

        $this->askRepository->save([
            'status' => $request->status
        ], $id);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Xử lý yêu cầu rút tiền xong',
        ]);
    }

    public function report(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $ask = $this->askRepository->save([
            'type' => 2,
            'denounced_id' => $request->denounced_id,
            'description' => $request->description,
            'owner_id' => $userId,
            'created_by' => $userId,
            'created_at' => Carbon::now()
        ]);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Tạo yêu cầu báo cáo thành công',
            'data' => [
                'ask_id' => $ask->id
            ]
        ]);
    }

    public function handleReport(Request $request, $id)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        if ($request->status != 2 && $request->status != 3) {
            return response()->json([
                'status' => 'Lỗi',
                'message' => 'Trạng thái không phù hợp!'
            ], 400);
        }

        $ask = $this->askRepository->getById($id);
        $userDenounced = $this->userRepository->getById($ask->denounced_id);

        if ($request->status == 2) {
            $this->userRepository->save([
                'reputation' => $userDenounced->reputation - 100,
                'updated_by' => $userId,
                'updated_at' => Carbon::now()
            ], $userDenounced->id);
        }

        $this->askRepository->save([
            'status' => $request->status
        ], $id);

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Xử lý báo cáo xong',
        ]);
    }

    public function getListWithdraw(Request $request)
    {
        $limit = $request->limit ?? 10;
        $withdraws = $this->askRepository->getListAskByType(1, $limit);
        $data = [];
        $memberData = [];
        foreach ($withdraws as $withdraw) {
            $memberData['id'] = $withdraw->id;
            $memberData['owner_id'] = $withdraw->owner_id;
            $memberData['amount'] = $withdraw->amount;
            $memberData['status'] = $this->getStatusAsk($withdraw->status);
            $memberData['description'] = $withdraw->description;
            $memberData['date'] = Carbon::parse( $withdraw->created_at)->format('d/m/Y');
            array_push($data, $memberData);
        }

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_page' => $withdraws->lastPage(),
            'total_items' => count($withdraws),
            'total_in_all_page' => $withdraws->total()
        ]);
    }

    public function getListReport(Request $request)
    {
        $limit = $request->limit ?? 10;
        $reports = $this->askRepository->getListAskByType(2, $limit);
        $data = [];
        $memberData = [];

        foreach ($reports as $report) {
            $memberData['id'] = $report->id;
            $memberData['owner_id'] = $report->owner_id;
            $memberData['denounced_id'] = $report->denounced_id;
            $memberData['description'] = $report->description;
            $memberData['status'] = $this->getStatusAsk($report->status);
            $memberData['image'] = AppConstant::$DOMAIN . 'api/asks/' . $report->id . '/images';
            $memberData['date'] = Carbon::parse( $report->created_at)->format('d/m/Y');
            array_push($data, $memberData);
        }

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_page' => $reports->lastPage(),
            'total_items' => count($reports),
            'total_in_all_page' => $reports->total()
        ]);
    }

    public function getListWithdrawByCurrentUser(Request $request)
    {
        $limit = $request->limit ?? 10;
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);
        $withdraws = $this->askRepository->getListAskByCurrentUser(1, $limit, $userId);
        $data = [];
        $memberData = [];
        foreach ($withdraws as $withdraw) {
            $memberData['id'] = $withdraw->id;
            $memberData['owner_id'] = $withdraw->owner_id;
            $memberData['amount'] = $withdraw->amount;
            $memberData['status'] = $this->getStatusAsk($withdraw->status);
            $memberData['description'] = $withdraw->description;
            $memberData['date'] = Carbon::parse( $withdraw->created_at)->format('d/m/Y');
            array_push($data, $memberData);
        }

        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu thành công',
            'data' => $data,
            'page' => $request->page ?? 1,
            'total_page' => $withdraws->lastPage(),
            'total_items' => count($withdraws),
            'total_in_all_page' => $withdraws->total()
        ]);
    }

    private function getStatusAsk($status)
    {
        switch ($status) {
            case 1:
                return 'Mới tạo';
            case 2:
                return 'Đã xử lý hoàn tất';
            case 3:
                return 'Đã hủy';
        }
    }
}
