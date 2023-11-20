<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterRequest;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
         if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $credentials = $request->only('email', 'password');

        $user = $this->userRepository->findUserByEmail($credentials['email']);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        if ($user->is_enable == 0) {
            return response()->json([
                'status' => 'failed',
                'message' => 'banned user can not login'
            ], 403);
        }

        $token = Auth::attempt($credentials);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        $user->refresh_token = Uuid::uuid4();

        $this->userRepository->save([
            'refresh_token' => $user->refresh_token,
            'token_expired' => Carbon::now()->addDays(4)
        ], $user->id);

        return response()->json([
                'status' => 'success',
                'message' => 'login sucessfully',
                'data' => [
                    'access_token' => $token,
                    'refresh_token' => $user->refresh_token,
                    'roles' => DB::table('user_roles')
                        ->where('user_id', $user->id)
                        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                        ->pluck('roles.role_name')
                        ->toArray(),
                    'user_id' => $user->id,
                    'username' => $user->name
                ],
            ]);

    }

    public function register(Request $request){

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'confirm_password' => 'required|string|same:password',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255'
        ]);
         if ($validator->fails()) {
             return response()->json(['error' => $validator->errors()], 400);
        }

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->save($data);

        DB::table('user_roles')->insert([
            'user_id' => $user->id,
            'role_id' => 2
        ]);

        DB::table('contact_details')->insert([
            'user_id' => $user->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        DB::table('users')->where('id', $user->id)
            ->update([
                'is_enable' => 1,
                'is_verify_email' => 0,
                'created_by' => $user->id,
                'updated_by' => $user->id
            ]);

        DB::table('wishlists')->insert(['user_id' => $user->id]);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'data' => [
                'email' => $user->email
            ]
        ]);
    }

    public function sendResetPasswordEmail(Request $request)
    {
        $user = $this->userRepository->findUserByEmail($request->email);

        if (!$user)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'not found user'
            ], 404);
        }

        $verifyCode = rand(10000000,99999999);

        $this->userRepository->save([
            'verify_code' => $verifyCode,
            'verify_code_expired' => Carbon::now()->addMinutes(1)
        ], $user->id);

        $mailData = [
            'subject' => 'Đặt lại mật khẩu Stugear',
            'content' => 'Chúng tôi sẽ giúp bạn đặt lại mật khẩu, chỉ cần gõ mã này dưới đây.',
            'verify_code' => $verifyCode,
            'signature' => 'Stugear'
        ];
        try {
            Mail::to($request->email)->send(new ResetPasswordMail($mailData));
            return response()->json([
                'status' => 'success',
                'message' => 'send reset password email successfully'
            ],200);
        } catch (\Throwable $th) {
            Log::error($th);
            return response()->json([
                'status' => 'fail',
                'message' => 'could not send email, try again'
            ],502);
        }
    }

    public function resetPassword(Request $request)
    {
        $user = $this->userRepository->findUserByEmail($request->email);

        if (!$user)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'not found user'
            ], 404);
        }

        if (Carbon::now() > $user->verify_code_expired)
        {
            return response()->json([
                'status' => 'failed',
                'message' => 'expired verify code'
            ], 400);
        }

        if ($request->verify_code == $user->verify_code) {
            $this->userRepository->save([
                'password' => Hash::make($request->password),
                'verify_code_expired' => Carbon::now()->subDays(4)
            ], $user->id);

            return response()->json([
                'status' => 'success',
                'message' => 'reset password successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'reset password failed, wrong verify code'
            ], 400);
        }
    }

    public function refresh(Request $request)
    {
        $user = $this->userRepository->getById($request->user_id);

        $bareToken = $request->token;
        $parts = explode('.', $bareToken);
        $payload = json_decode(base64_decode($parts[1]));
        $now = time();
        $signature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], env('JWT_SECRET'), true);
        $computedBase64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        if ($computedBase64UrlSignature != $parts[2]) {
            return response()->json([
                'status' => 'error',
                'message' => 'token invalid'
            ],498);

        }

        if (Carbon::now() > $user->token_expired) {
            return response()->json([
                'status' => 'error',
                'message' => 'Phiên đăng nhập đã hết hạn, hãy đăng nhập lại!'
            ],401);
        }
        if ($user->refresh_token == $request->refresh_token) {
            return response()->json([
                'status' => 'success',
                'message' => 'refresh token sucessfully',
                'data' => [
                    'access_token' => JWTAuth::parseToken()->refresh(),
                    'refresh_token' => $user->refresh_token,
                    'roles' => DB::table('user_roles')
                        ->where('user_id', $request->user_id)
                        ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                        ->pluck('roles.role_name')
                        ->toArray(),
                    'user_id' => $user->id,
                    'username' => $user->name
                ]
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'lỗi không đúng refresh token',
            ],498);
        }
    }

}
