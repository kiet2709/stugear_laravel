<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Jung-kook',
                'email' => 'jungkook_jeon@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Jung-kook',
                'last_name' => 'Jeon',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Thanh Tùng',
                'email' => 'thanhtung_nguyen@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Thanh Tùng',
                'last_name' => 'Nguyễn',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Vĩ Văn',
                'email' => 'vivan_hua@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Vĩ Văn',
                'last_name' => 'Hứa',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Lệ Dĩnh',
                'email' => 'ledinh_trieu@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Lệ Dĩnh',
                'last_name' => 'Triệu',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Mặc Sênh',
                'email' => 'macsenh_trieu@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Mặc Sênh',
                'last_name' => 'Triệu',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Hạc Đệ',
                'email' => 'hacde_vuong@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Hạc Đệ',
                'last_name' => 'Vương',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Ga-young',
                'email' => 'gayoung_moon@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Ga-young',
                'last_name' => 'Moon',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Eun-woo',
                'email' => 'eunwoo_cha@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Eun-woo',
                'last_name' => 'Cha',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Dĩ Thâm',
                'email' => 'ditham_ha@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Dĩ Thâm',
                'last_name' => 'Hà',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ],
            [
                'name' => 'Diệc Phi',
                'email' => 'diecphi_luu@gmail.com',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'first_name' => 'Diệc Phi',
                'last_name' => 'Lưu',
                'reputation' => rand(10, 100),
                'is_enable' => 1,
                'is_verify_email' => rand(0, 1),
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day')),
            ]
        ];

        $user_roles = [
            [
                'user_id' => 1,
                'role_id' => 1,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 2,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 3,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 4,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 5,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 6,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 7,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 8,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 9,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
            [
                'user_id' => 10,
                'role_id' => 2,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years')),
                'updated_at' => date('Y-m-d H:i:s', strtotime('-' . rand(1, 5) . ' years +1 day'))
            ],
        ];

        foreach($users as $user){
            DB::table('users')->insert([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => $user['password'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'reputation' => $user['reputation'],
                'is_enable' => $user['is_enable'],
                'is_verify_email' => $user['is_verify_email'],
                'created_by' => $user['created_by'],
                'updated_by' => $user['updated_by'],
                'created_at' => $user['created_at'],
                'updated_at' => $user['updated_at'],
            ]);
        }

        foreach($user_roles as $user_role) {
            DB::table('user_roles')->insert([
                'user_id' => $user_role['user_id'],
                'role_id' => $user_role['role_id'],
                'created_by' => $user_role['created_by'],
                'updated_by' => $user_role['updated_by'],
                'created_at' => $user_role['created_at'],
                'updated_at' => $user_role['updated_at']
            ]);
        }

        for($i = 1; $i <= 10; $i++){
            DB::table('wishlists')->insert(['user_id' => $i]);
        }
    }
}
