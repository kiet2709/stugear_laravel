<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->foreign('product_id')->references('id')->on('products');
            $table->unsignedBigInteger('price')->default(0);
            $table->unsignedBigInteger('quantity');
            $table->unsignedBigInteger('total');
            $table->integer('status')->default(1);
            $table->integer('created_by')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->integer('updated_by')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->integer('deleted_by')->nullable();
            $table->dateTime('deleted_at')->nullable();
        });
        // định nghĩa các status
        // 1: đang xử lý (auto)
        // 2: đang giao hàng (seller)
        // 3: đã giao hàng (seller)
        // 4: đã nhận được hàng (kết thúc) (buyer)
        // 5: hoàn hàng (buyer)
        // 6: đã nhận được hàng hoàn  (seller)
        // 7: hoàn tiền (admin)

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
