<?php

namespace App\Util;

class AppConstant {
    public static $UPLOAD_DIRECTORY_USER_IMAGE = 'uploads/users';
    public static $UPLOAD_DIRECTORY_CATEGORY_IMAGE = 'uploads/categories';
    public static $UPLOAD_DIRECTORY_PRODUCT_IMAGE = 'uploads/products';
    public static $UPLOAD_DIRECTORY_ASK_IMAGE = 'uploads/asks';

    public static $UPLOAD_SUCCESS = "Upload successfully!";

    public static $UPLOAD_FAILURE = "Upload fail, please check again!";



    public static $ERROR_WITH_IMAGE = "There're some errors with image!";

    public static $DOMAIN = 'http://52.205.41.43/';
    // public static $DOMAIN = 'http://localhost:8000/';

    public static $AVATAR_MALE = 'https://hoaminhngoc.vn/wp-content/uploads/2023/01/cute-1-300x300.png';
    public static $AVATAR_FEMALE = 'https://www.studytienganh.vn/upload/2022/05/112273.jpg';
    public static $PRODUCT_THUMBNAIL = 'https://nordicdesign.ca/wp-content/uploads/2020/02/book-thumbnail.jpg';

    public static $CATEGORY_THUMBNAIL = 'https://o2osell.com/cat_img/default.png?1587036898';

    public static $ASK_THUMBNAIL = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';

    public static $STATUS_PRODUCT = [
        'chặn' => '0',
        'nháp' => '1',
        'chờ duyệt' => '2',
        'đã duyệt' => '3',
        'đã bán' => '4',
        'đã thanh toán' => '5'
    ];

    public static $TRANSACTION_METHOD = [
        'Tự do' => '1',
        'Trên web' => '2',
    ];
}
