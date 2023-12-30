<?php

use App\Models\Comment;
use App\Repositories\Comment\CommentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery as m;
use PHPUnit\Framework\TestCase;
use Illuminate\Support\Collection;

class CommentRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();

        $this->repositoryMock = m::mock(CommentRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testGetCommentByProductIdReturnsPaginatorOnSuccess()
    {
        // Sắp xếp
        $id = 1;
        $limit = 10;

        // Mô phỏng cho DB facade
        DB::shouldReceive('table')->with('comments')->andReturnSelf();
        DB::shouldReceive('where')->with('product_id', $id)->andReturnSelf();
        DB::shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Hành động
        $result = $this->repositoryMock->getCommentByProductId($id, $limit);

        // Kiểm tra
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    public function testGetCommentByParentIdReturnsCollectionOnSuccess()
    {
        // Sắp xếp
        $parentId = 1;

        // Mô phỏng cho DB facade
        DB::shouldReceive('table')->with('comments')->andReturnSelf();
        DB::shouldReceive('where')->with('parent_id', $parentId)->andReturnSelf();
        DB::shouldReceive('get')->andReturn(new Collection()); // Sử dụng Illuminate\Support\Collection

        // Hành động
        $result = $this->repositoryMock->getCommentByParentId($parentId);

        // Kiểm tra
        $this->assertInstanceOf(Collection::class, $result);
    }

    public function testGetCommentWithParentIdZeroByProductIdReturnsPaginatorOnSuccess()
    {
        // Sắp xếp
        $productId = 1;
        $limit = 10;

        // Mô phỏng cho DB facade
        DB::shouldReceive('table')->with('comments')->andReturnSelf();
        DB::shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        DB::shouldReceive('where')->with('parent_id', 0)->andReturnSelf();
        DB::shouldReceive('orderBy')->with('updated_at', 'desc')->andReturnSelf();
        DB::shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Hành động
        $result = $this->repositoryMock->getCommentWithParentIdZeroByProductId($productId, $limit);

        // Kiểm tra
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }


    // Helper method to set protected/private properties in a class
    protected function setProperty($object, $property, $value)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($property);
        $property->setAccessible(true);
        $property->setValue($object, $value);
    }
}

