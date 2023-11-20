<?php

namespace App\Http\Controllers;

use App\Repositories\Rating\RatingRepositoryInterface;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    protected $ratingRepository;

    public function __construct(RatingRepositoryInterface $ratingRepository)
    {
        $this->ratingRepository = $ratingRepository;
    }
    public function getRatingByProductId($productId)
    {
        $ratings = $this->ratingRepository->getRatingByProductId($productId);
        $data = [];
        $memberRate = [];
        for ($i = 1; $i <= 5; $i++) {
            $memberRate[] = [
                'id' => $i,
                'rate' => 0,
                'quantity' => 0,
            ];
        }
        $sumStar = 0;
        $sumQuantity = 0;
        foreach ($ratings as $item) {
            $rating = $item->rating_id;
            $quantity = $item->quantity;

            $memberRate[$rating - 1]['rate'] = $rating;
            $memberRate[$rating - 1]['quantity'] += $quantity;
            $sumStar = $sumStar + $rating * $quantity;
            $sumQuantity += $quantity;
        }
        $data['rate'] = $memberRate;
        $data['total'] = $sumQuantity;
        $data['average'] = $sumQuantity != 0 ? round($sumStar/$sumQuantity, 1) : 0;
        return response()->json([
            'status' => 'Thành công',
            'message' => 'Lấy comment thành công',
            'data' => $data
        ]);
    }
}
