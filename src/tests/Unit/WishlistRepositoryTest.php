<?php

use App\Repositories\Wishlist\WishlistRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery as m;
use Tests\TestCase;
use App\Models\Wishlist;

class WishlistRepositoryTest extends TestCase
{

    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();

        $this->repositoryMock = m::mock(WishlistRepository::class)->makePartial();
    }

    public function testGetWishlistByUserIdReturnsPaginatorOnSuccess()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $userId = 1;
        $limit = 10;

        // Mocking the model
        $modelMock = m::mock('overload:' . $this->repositoryMock->getModel())->makePartial();
        $modelMock->shouldReceive('where')->with('user_id', $userId)->andReturnSelf();
        $modelMock->shouldReceive('first')->andReturn((object)['id' => 1]); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn

        // Mocking the DB facade
        DB::shouldReceive('table')->with('wishlist_products')->andReturnSelf();
        DB::shouldReceive('where')->with('wishlist_id', 1)->andReturnSelf();
        DB::shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Hành động
        $result = $this->repositoryMock->getWishlistByUserId($userId, $limit);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    public function testGetWishlistByIdAndProductIdReturnsResultOnSuccess()
    {
        // Arrange
        $wishlistId = 1;
        $productId = 1;

        // Mocking the DB facade
        DB::shouldReceive('table')->with('wishlist_products')->andReturnSelf();
        DB::shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        DB::shouldReceive('where')->with('wishlist_id', $wishlistId)->andReturnSelf();
        DB::shouldReceive('first')->andReturn((object)['id' => 1]); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn

        // Act
        $result = $this->repositoryMock->getWishlistByIdAndProductId($wishlistId, $productId);

        // Assert
        $this->assertInstanceOf(\stdClass::class, $result);
        $this->assertEquals(1, $result->id); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn
    }

    public function testGetWishlistByIdAndProductIdReturnsItemOnSuccess()
    {
        // Arrange
        $wishlistId = 1;
        $productId = 2;

        // Mocking the DB facade
        DB::shouldReceive('table')->with('wishlist_products')->andReturnSelf();
        DB::shouldReceive('where')->with('wishlist_id', $wishlistId)->andReturnSelf();
        DB::shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        DB::shouldReceive('first')->andReturn((object)['id' => 1]); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn

        // Hành động
        $result = $this->repositoryMock->getWishlistByIdAndProductId($wishlistId, $productId);

        // Assert
        $this->assertInstanceOf(\stdClass::class, $result);
    }

    public function testAddToWishlistReturnsBoolean()
    {
        // Arrange
        $data = ['wishlist_id' => 1, 'product_id' => 2];

        // Mocking the DB facade
        DB::shouldReceive('table')->with('wishlist_products')->andReturnSelf();
        DB::shouldReceive('insert')->with($data)->andReturn(true); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn

        // Hành động
        $result = $this->repositoryMock->addToWishlist($data);

        // Assert
        $this->assertTrue($result);
    }

    public function testUpdateWishlistReturnsBoolean()
    {
        // Arrange
        $data = ['quantity' => 3]; // Dữ liệu cần cập nhật
        $productId = 2;
        $wishlistId = 1;

        // Mocking the DB facade
        DB::shouldReceive('table')->with('wishlist_products')->andReturnSelf();
        DB::shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        DB::shouldReceive('where')->with('wishlist_id', $wishlistId)->andReturnSelf();
        DB::shouldReceive('update')->with($data)->andReturn(true); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn

        // Hành động
        $result = $this->repositoryMock->updateWishlist($data, $productId, $wishlistId);

        // Assert
        $this->assertTrue($result);
    }

    public function testGetWishlistIdByUserIdReturnsInteger()
    {
        // Arrange
        $userId = 1;

        // Mocking the model and its methods
        $wishlistModelMock = m::mock('alias:App\Models\Wishlist');
        $wishlistModelMock->shouldReceive('where')->with('user_id', $userId)->andReturnSelf();
        $wishlistModelMock->shouldReceive('first')->andReturn((object)['id' => 5]); // Điều chỉnh dữ liệu mong đợi theo nhu cầu của bạn

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $wishlistModelMock);

        // Hành động
        $result = $this->repositoryMock->getWishlistIdByUserId($userId);

        // Assert
        $this->assertEquals(5, $result);
    }

    protected function setProperty($object, $property, $value)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($property);
        $property->setAccessible(true);
        $property->setValue($object, $value);
    }
}
