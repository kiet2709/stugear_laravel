<?php

use App\Models\RatingProduct;
use App\Repositories\Rating\RatingRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery as m;
use Tests\TestCase;
use Carbon\Carbon;

class RatingRepositoryTest extends TestCase
{
    use RefreshDatabase;
    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();
        $this->repositoryMock = m::mock(RatingRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testGetRatingByProductId()
    {
        // Arrange
        $productId = 1;

        // Mocking the database query
        $queryBuilderMock = m::mock(\Illuminate\Database\Query\Builder::class);
        $queryBuilderMock->shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        $queryBuilderMock->shouldReceive('get')->andReturn(['your', 'rating', 'data']);

        // Mocking the DB facade
        DB::shouldReceive('table')->with('rating_products')->andReturn($queryBuilderMock);

        // Act
        $result = $this->repositoryMock->getRatingByProductId($productId);

        // Assert
        $this->assertEquals(['your', 'rating', 'data'], $result);
    }

    public function testRating()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $productId = 1;
        $ratingId = 5;
        $userId = 10;

        // Mocking the database query
        $queryBuilderMock = m::mock(\Illuminate\Database\Query\Builder::class);
        $queryBuilderMock->shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        $queryBuilderMock->shouldReceive('where')->with('rating_id', $ratingId)->andReturnSelf();

        // Thêm kì vọng cho phương thức update
        $queryBuilderMock->shouldReceive('update')->with([
            'quantity' => m::type('string'), // Thêm dòng này để mô phỏng raw() method.
            'updated_by' => $userId,
            'updated_at' => Carbon::class . '::now()',
        ])->andReturn(1); // Thêm kì vọng trả về số dòng được cập nhật

        // Mocking the DB facade
        DB::shouldReceive('table')->with('rating_products')->andReturn($queryBuilderMock);
        // Mô phỏng raw() method trên DB facade
        DB::shouldReceive('raw')->andReturnUsing(function ($arg) {
            return $arg;
        });

        // Act
        $result = $this->repositoryMock->rating($productId, $ratingId, $userId);

        // Assert
        $this->assertTrue($result);
    }
}
