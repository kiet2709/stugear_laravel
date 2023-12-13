<?php

namespace App\Http\Controllers;

use App\Util\AuthService;
use App\Util\ImageService;
use App\Util\AppConstant;
use Illuminate\Http\Request;
use App\Repositories\User\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $userRepository;
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }


    public function index()
    {
        $users = $this->userRepository->getAllUserWithContactDetail();
        return response()->json([
            'status' => 'success',
            'message' => 'get data sucesss',
            'data' => $users
        ]);
    }

    public function view($id)
    {
        $users = $this->userRepository->getUserWithContactDetailById($id);
        return response()->json([
            'status' => 'success',
            'message' => 'get data sucesss',
            'data' => $users
        ]);
    }

    public function getCurrentUserInfo(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);
        $user = $this->userRepository->getById($userId);
        $userInfo = $this->userRepository->getContactDetail($userId);
        $data = [];
        $data['id'] = $user->id;
        $data['email'] = $user->email;
        $data['name'] = $user->name;
        $data['is_verify'] = $user->is_verify_email == 0 ? 'false' : 'true';
        $data['reputation'] = $user->reputation;
        if ($user->image_id == null) {
            if (!isset($userInfo->gender) || $userInfo->gender == 0 || $userInfo->gender == null) {
                $data['image'] = AppConstant::$AVATAR_MALE;
            } else {
                $data['image'] = AppConstant::$AVATAR_FEMALE;
            }
        } else {
            $data['image'] = AppConstant::$DOMAIN . 'api/users/' . $user->id . '/images' ;
        }
        $data['first_name'] = $user->first_name;
        $data['last_name'] = $user->last_name;
        $data['gender'] = $userInfo->gender ?? '';
        $data['city'] = $userInfo->city ?? '';
        $data['province'] = $userInfo->province ?? '';
        $data['district'] = $userInfo->district ?? '';
        $data['ward'] = $userInfo->ward ?? '';
        $data['full_address'] = $userInfo->full_address ?? '';
        $data['phone_number'] = $userInfo->phone_number ?? '';
        $data['birthdate'] = $userInfo->birthdate ?? '';
        $data['social_link'] = $userInfo->social_link ?? '';
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy dữ liệu user thành công',
            'data' => $data
        ]);

    }

    public function uploadImage(Request $request, $id){
        $message = ImageService::uploadImage($request, $id, AppConstant::$UPLOAD_DIRECTORY_USER_IMAGE, 'users');

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
        $user = $this->userRepository->getById($id);
        if ($user->image_id == null) {
            $userInfo = $this->userRepository->getContactDetail($id);
            if ($userInfo->gender == null || $userInfo->gender == 0) {
                $imageData = file_get_contents(AppConstant::$AVATAR_MALE);
            } else {
                $imageData = file_get_contents(AppConstant::$AVATAR_FEMALE);
            }

            header('Content-Type: image/jpeg');

            echo $imageData;
        } else {
            $path = ImageService::getPathImage($id, 'users');
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

    public function updateStatus(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|min:1',
            'status' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $this->userRepository->save([
            'is_enable' => strval($request->status),
            'updated_at'=> Carbon::now(),
            'updated_by' => $request->user_id
        ], $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái người dùng thành công',
        ]);
    }

    public function updateProfile(Request $request){
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $validator = Validator::make($request->all(), [
            'first_name' => 'string',
            'last_name' => 'string',
            'gender' => 'in:0,1',
            'birthdate' => 'date',
        ]);

        if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $user = $this->userRepository->getById($userId);

        $dataUser = [
            'first_name' => $request->first_name ?? $user->first_name,
            'last_name' => $request->last_name ?? $user->last_name,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId,
        ];

        $userInfo = $this->userRepository->getContactDetail($userId);

        $ward = $request->ward ?? $userInfo->ward;
        $district = $request->district ?? $userInfo->district;
        $city = $request->city ?? $userInfo->city;
        $province = $request->province ?? $userInfo->province;

        $ward2 = $ward != null || $ward != '' ? $ward . ' ' : null;
        $district2 = $district != null || $district != '' ? $district . ' ' : null;
        $city2 = $city != null || $city != '' ? $city .  ' ' : null;
        $province2 = $province != null || $city != '' ? $province . ' ' : null;

        $dataContactUser = [
            'gender' => $request->gender ?? $userInfo->gender,
            'phone_number' => $request->phone_number ?? $userInfo->phone_number,
            'birthdate' => $request->birthdate ?? $userInfo->birthdate,
            'ward' => $ward,
            'district' => $district,
            'city' => $city,
            'province' => $province,
            'full_address' => $ward2 .  $district2 . $city2 . $province2,
            'social_link' => $request->social_link ?? $userInfo->social_link,
            'updated_at' => Carbon::now(),
            'updated_by' => $userId,
        ];

        $this->userRepository->save($dataUser,$userId);
        $this->userRepository->updateContactDetail($dataContactUser, $userId);

        return response()->json([
            'status'=> 'Thành công',
            'message'=> 'Cập nhật thông tin thành công',
        ]);
    }

    public function getCurrentUserBalance(Request $request)
    {
        $token = $request->header();
        $bareToken = substr($token['authorization'][0], 7);
        $userId = AuthService::getUserId($bareToken);

        $user = $this->userRepository->getById($userId);

        return response()->json([
            'user_id' => $userId,
            'balance' => number_format($user->wallet) . ' VNĐ'
        ]);
    }
}
