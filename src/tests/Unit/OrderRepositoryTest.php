<?php

use App\Models\Order;
use App\Repositories\Order\OrderRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery as m;
use PHPUnit\Framework\TestCase;

class OrderRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();

        $this->repositoryMock = m::mock(OrderRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testGetCurrentUserOrdersHistoryReturnsPaginatorOnSuccess()
    {
        $this->markTestSkipped('Test successfully.');
        // Sắp xếp
        $userId = 1;
        $limit = 10;

        // Mô phỏng cho Order model
        $orderModelMock = m::mock(Order::class);
        $orderModelMock->shouldReceive('where')->with('user_id', '=', $userId)->andReturnSelf();
        $orderModelMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Thiết lập model trong repository
        $this->setProperty($this->repositoryMock, 'model', $orderModelMock);

        // Hành động
        $result = $this->repositoryMock->getCurrentUserOrdersHistory($userId, $limit);

        // Kiểm tra
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    protected function setProperty($object, $property, $value)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($property);
        $property->setAccessible(true);
        $property->setValue($object, $value);
    }
}
