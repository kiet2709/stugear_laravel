<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\DB;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function getModel()
    {
        return User::class;
    }

    /**
     * Find user by email
     *
     * @param mixed $email
     * @return \App\Models\User
     */
    public function findUserByEmail($email)
    {
        $user = User::where('email', $email)->first();
        return $user;
    }


    public function getAllUserWithContactDetail()
    {
        $usersWithContactDetails = DB::table('users')
        ->join('contact_details', 'users.id', '=', 'contact_details.user_id')
        ->select('users.id',
        'users.name',
        'users.email',
        'users.first_name',
        'last_name',
        'is_enable',
        'contact_details.phone_number',
        'contact_details.gender',
        'contact_details.birthdate',
        'contact_details.full_address',
        'contact_details.province',
        'contact_details.ward',
        'contact_details.district',
        'contact_details.city',
        'contact_details.social_link',)
        ->get();
        return $usersWithContactDetails;
    }

    public function getUserWithContactDetailById($id)
    {
        $usersWithContactDetails = DB::table('users')
        ->join('contact_details', 'users.id', '=', 'contact_details.user_id')->where('users.id','=',$id)
        ->select('users.id',
        'users.name',
        'users.email',
        'users.first_name',
        'users.reputation',
        'last_name',
        'is_enable',
        'contact_details.phone_number',
        'contact_details.gender',
        'contact_details.birthdate',
        'contact_details.full_address',
        'contact_details.province',
        'contact_details.ward',
        'contact_details.district',
        'contact_details.city',
        'contact_details.social_link',)
        ->get();
        return $usersWithContactDetails;
    }

    public function getContactDetail($userId)
    {
        $result = DB::table('contact_details')->where('user_id', $userId)->first();
        return $result;
    }

    public function updateContactDetail($data, $userId)
    {
        $result = DB::table('contact_details')->where('user_id',$userId)
        ->update($data);
        return $result;
    }

}
