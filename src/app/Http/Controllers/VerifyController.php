<?php

namespace App\Http\Controllers;

use App\Mail\EmailVerificationMail;
use App\Repositories\User\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;


class VerifyController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function sendVerifyEmail(Request $request)
    {
        $user = $this->userRepository->findUserByEmail($request->email);

        if (!$user)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'not found user'
            ], 404);
        }

        if ($user->is_verify_email == 1) {
            return response()->json([
                'status' => 'not success',
                'message' => 'email has been verified'
            ], 409);
        }

        $verifyCode = rand(10000000,99999999);

        $this->userRepository->save([
            'verify_code' => $verifyCode,
            'verify_code_expired' => Carbon::now()->addMinutes(1)
        ], $user->id);
        
        $mailData = [
            'subject' => 'Stugear xin chào',
            'content' => 'Chúng tôi rất vui mừng khi bạn bắt đầu. Đầu tiên, bạn cần xác nhận email của mình. Chỉ cần gõ mã này dưới đây.',
            'verify_code' => $verifyCode,
            'signature' => 'Stugear'
        ];
        try {
            Mail::to($request->email)->send(new EmailVerificationMail($mailData));
            return response()->json([
                'status' => 'success',
                'message' => 'send verified email successfully'
            ],200);
        } catch (\Throwable $th) {
            Log::error($th);
            return response()->json([
                'status' => 'fail',
                'message' => 'could not send email, try again'
            ],502);
        }
    }

    public function verifyEmail(Request $request) 
    {
        $user = $this->userRepository->findUserByEmail($request->email);

        if (!$user)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'not found user'
            ], 404);
        }

        if ($user->is_verify_email == 1) {
            return response()->json([
                'status' => 'not success',
                'message' => 'email has been verified'
            ], 409);
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
                'is_verify_email' => 1
            ], $user->id);

            return response()->json([
                'status' => 'success',
                'message' => 'email verifies successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'email verifies failed, wrong verify code'
            ], 400);
        }
    }
}
