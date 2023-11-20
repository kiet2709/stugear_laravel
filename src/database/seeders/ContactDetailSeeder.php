<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker;
use Illuminate\Support\Facades\DB;

class ContactDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ward = 'Phường ' . rand(1, 17);
        $district = 'Quận ' . rand(1, 10);
        $contact_details = [
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 0,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Thành phố Hồ Chí Minh',
                'ward' => $ward, // 'Phường' + số ngẫu nhiên từ 1 đến 17
                'district' => '$district', // Sửa đổi thành quận mà bạn muốn
                'city' => 'Thành phố Hồ Chí Minh',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'jung_kook', // Thay tên và mạng xã hội theo yêu cầu
                'user_id' => 1, // Thay giá trị user_id theo yêu cầu của bạn
                'created_by' => 1, // Thay giá trị theo người tạo (created_by) theo yêu cầu
                'updated_by' => 1, // Thay giá trị theo người cập nhật (updated_by) theo yêu cầu
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Thành phố Hồ Chí Minh' . ', ' . 'Thành phố Hồ Chí Minh', // Thêm trường full_address
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 0,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Hà Nội', // Sửa thành Hà Nội
                'ward' => $ward,
                'district' => $district,
                'city' => 'Hà Nội', // Sửa thành Hà Nội
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'thanhtung',
                'user_id' => 2,
                'created_by' => 2,
                'updated_by' => 2,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Hà Nội' . ', ' . 'Hà Nội',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 0,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Thành phố Hồ Chí Minh',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Thành phố Hồ Chí Minh',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'vivan',
                'user_id' => 3,
                'created_by' => 3,
                'updated_by' => 3,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Thành phố Hồ Chí Minh' . ', ' . 'Thành phố Hồ Chí Minh',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 1,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Hà Nội',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Hà Nội',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'ledinh',
                'user_id' => 4,
                'created_by' => 4,
                'updated_by' => 4,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Hà Nội' . ', ' . 'Hà Nội',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 1,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Quảng Nam',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Quảng Nam',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'duongyen',
                'user_id' => 5,
                'created_by' => 5,
                'updated_by' => 5,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Quảng Nam' . ', ' . 'Quảng Nam',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 0,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Bình Dương',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Bình Dương',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'hacde',
                'user_id' => 6,
                'created_by' => 6,
                'updated_by' => 6,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Bình Dương' . ', ' . 'Bình Dương',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 1,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Thanh Hóa',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Thanh Hóa',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'gayoung',
                'user_id' => 7,
                'created_by' => 7,
                'updated_by' => 7,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Thanh Hóa' . ', ' . 'Thanh Hóa',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 0,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Thành phố Hồ Chí Minh',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Thành phố Hồ Chí Minh',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'eunwoo',
                'user_id' => 8,
                'created_by' => 8,
                'updated_by' => 8,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Thành phố Hồ Chí Minh' . ', ' . 'Thành phố Hồ Chí Minh',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 0,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Đồng Nai',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Đồng Nai',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'ditham',
                'user_id' => 9,
                'created_by' => 9,
                'updated_by' => 9,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Đồng Nai' . ', ' . 'Đồng Nai',
            ],
            [
                'phone_number' => '0' . str_pad(rand(0, 9999999999), 10, '0', STR_PAD_LEFT),
                'gender' => 1,
                'birthdate' => date('Y-m-d', strtotime('1990-01-01 +' . rand(0, 5760) . ' days')),
                'province' => 'Đồng Nai',
                'ward' => $ward,
                'district' => $district,
                'city' => 'Đồng Nai',
                'social_link' => 'https://www.' . ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'][rand(0, 3)] . '/' . 'ditham',
                'user_id' => 10,
                'created_by' => 10,
                'updated_by' => 10,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(0, 365) . ' days')),
                'full_address' => $ward . ', ' . $district . ', ' . 'Đồng Nai' . ', ' . 'Đồng Nai',
            ],
        ];

        foreach($contact_details as $contact_detail) {
            DB::table('contact_details')->insert([
                'phone_number' => $contact_detail['phone_number'],
                'gender' => $contact_detail['gender'],
                'birthdate' => $contact_detail['birthdate'],
                'full_address' => $contact_detail['full_address'],
                'province' => $contact_detail['province'],
                'ward' => $contact_detail['ward'],
                'district' => $contact_detail['district'],
                'city' => $contact_detail['city'],
                'social_link' => $contact_detail['social_link'],
                'user_id' => $contact_detail['user_id'],
                'created_by' => $contact_detail['created_by'],
                'updated_by' => $contact_detail['updated_by'],
                'created_at' => $contact_detail['created_at'],
                'updated_at' => $contact_detail['updated_at']
            ]);
        }
    }
}
