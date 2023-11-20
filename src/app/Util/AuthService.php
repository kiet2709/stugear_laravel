<?php

namespace App\Util;

class AuthService {
    public static function getUserId($jwt) {
        $parts = explode('.', $jwt);
        $payload = json_decode(base64_decode($parts[1]));
        return $payload->id;
    }
}
