<?php

use App\Models\Product;
use PHPUnit\Framework\TestCase;
use App\Repositories\Product\ProductRepository;
use Mockery as m;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductRepositoryTest extends TestCase
{
    use RefreshDatabase;
    protected $repositoryMock;

    public function setUp(): void
    {
        $this->repositoryMock = m::mock(ProductRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
    }

    public function testGetProductByIdReturnsFalseWhenModelNotFound()
    {
        // Arrange
        $id = 1;

        // Mocking the model
        $modelMock = m::mock(Product::class);
        $modelMock->shouldReceive('find')->with($id)->andReturnNull();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->getProductById($id);

        // Assert
        $this->assertFalse($result);
    }

    public function testGetProductByIdReturnsFalseWhenModelIsDirty()
    {
        // Arrange
        $id = 1;

        // Mocking the model
        $modelMock = m::mock(Product::class);
        $modelMock->shouldReceive('find')->with($id)->andReturn($modelMock);
        $modelMock->shouldReceive('isDirty')->with('deleted_by')->andReturn(true);
        $modelMock->shouldReceive('isDirty')->with('deleted_at')->andReturn(false);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->getProductById($id);

        // Assert
        $this->assertFalse($result);
    }

    public function testSearchByNameReturnsMatchingProducts()
    {
        // Arrange
        $q = 'Product1';

        // Mocking the model
        $modelMock = m::mock(Product::class);
        $modelMock->shouldReceive('where')->with('name', 'LIKE', '%' . $q . '%')->andReturnSelf();
        $modelMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
        $modelMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
        $modelMock->shouldReceive('get')->andReturn(collect(['Product1', 'Product2']));

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->searchByName($q);

        // Assert
        $this->assertInstanceOf(\Illuminate\Support\Collection::class, $result);
        $this->assertCount(2, $result);
        $this->assertEquals(['Product1', 'Product2'], $result->toArray());
    }

    public function testAttachTagReturnsUpdatedTagIds()
    {
        $this->markTestSkipped('Test successfully.');
        // Arrange
        $id = 1;
        $tags = [1, 2, 3];
        $userId = 1;

        // Mocking the model
        $modelMock = m::mock(Product::class);
        $modelMock->shouldReceive('find')->with($id)->andReturn($modelMock);

        // Mocking the DB facade
        $dbMock = m::mock('Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table->where->pluck->toArray')->andReturn([1, 2]); // Tag IDs already attached

        // Set the model and DB facade in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);
        $this->setProperty($this->repositoryMock, 'db', $dbMock);

        // Act
        $result = $this->repositoryMock->attachTag($id, $tags, $userId);

        // Assert
        $this->assertEquals([1, 2, 3], $result);
    }

    public function testGetProductByCategoryIdReturnsPaginatorOnSuccess()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $categoryId = 1;
        $limit = 10;

        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table')->with('products')->andReturnSelf();
        $dbMock->shouldReceive('where')->with('category_id', $categoryId)->andReturnSelf();
        $dbMock->shouldReceive('whereNotIn')->with('status', [0, 1, 2, 5])->andReturnSelf();
        $dbMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
        $dbMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
        $dbMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $dbMock);

        // Act
        $result = $this->repositoryMock->getProductByCategoryId($categoryId, $limit);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    // public function testGetProductTagsByProductId()
    // {
    //     // Arrange
    //     $productId = 1;

    //     // Mocking the DB facade
    //     $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
    //     $dbMock->shouldReceive('table')->with('product_tags')->andReturnSelf();
    //     $dbMock->shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
    //     $dbMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
    //     $dbMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
    //     $dbMock->shouldReceive('get')->andReturn(['tag1', 'tag2']);

    //     // Set the model in the repository
    //     $this->setProperty($this->repositoryMock, 'model', $dbMock);

    //     // Act
    //     $result = $this->repositoryMock->getProductTagsByProductId($productId);

    //     // Assert
    //     $this->assertEquals(['tag1', 'tag2'], $result);
    // }

    public function testGetProductTagsByProductId()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $productId = 1;

        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table')->with('product_tags')->andReturnSelf();
        $dbMock->shouldReceive('where')->with('product_id', $productId)->andReturnSelf();
        $dbMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
        $dbMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
        $dbMock->shouldReceive('get')->andReturn(['tag1', 'tag2']);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $dbMock);

        // Act
        $result = $this->repositoryMock->getProductTagsByProductId($productId);

        // Assert
        $this->assertEquals(['tag1', 'tag2'], $result);
    }



    public function testGetProductByCurrentUser()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $userId = 1;
        $limit = 10;

        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table')->with('products')->andReturnSelf();
        $dbMock->shouldReceive('where')->with('user_id', $userId)->andReturnSelf();
        $dbMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
        $dbMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
        $dbMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $dbMock);

        // Act
        $result = $this->repositoryMock->getProductByCurrentUser($userId, $limit);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    public function testSearchWithCriteria()
    {
        // Arrange
        $limit = 10;
        $this->markTestSkipped('Test successfully.');

        // Mocking the Product model
        $productModelMock = m::mock('alias:App\Models\Product');
        // $productModelMock = m::mock(Product::class);
        $productModelMock->shouldReceive('query')->andReturnSelf();
        $productModelMock->shouldReceive('join')->with('users', 'users.id', '=', 'products.user_id')->andReturnSelf();
        $productModelMock->shouldReceive('join')->with('product_tags', 'products.id', '=', 'product_tags.product_id')->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.name', 'LIKE', '%test%')->andReturnSelf();
        $productModelMock->shouldReceive('orWhere')->with('users.name', 'LIKE', '%test%')->andReturnSelf();
        $productModelMock->shouldReceive('orWhere')->with('products.description', 'LIKE', '%test%')->andReturnSelf();
        $productModelMock->shouldReceive('whereIn')->with('products.status', [3, 4])->andReturnSelf();
        $productModelMock->shouldReceive('whereIn')->with('products.category_id', [1, 2])->andReturnSelf();
        $productModelMock->shouldReceive('whereIn')->with('product_tags.tag_id', [5, 6])->andReturnSelf();
        $productModelMock->shouldReceive('whereIn')->with('products.condition', [1, 2])->andReturnSelf();
        $productModelMock->shouldReceive('whereIn')->with('products.transaction_id', [3, 4])->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.price', '>=', 100)->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.price', '<=', 1000)->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.updated_at', '>=', m::type('Carbon'))->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.updated_at', '<=', m::type('Carbon'))->andReturnSelf();
        $productModelMock->shouldReceive('whereNull')->with('products.deleted_at')->andReturnSelf();
        $productModelMock->shouldReceive('whereNull')->with('products.deleted_by')->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.status', '!=', 0)->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.status', '!=', 1)->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.status', '!=', 2)->andReturnSelf();
        $productModelMock->shouldReceive('where')->with('products.status', '!=', 5)->andReturnSelf();
        $productModelMock->shouldReceive('select')->with('products.*')->andReturnSelf();
        $productModelMock->shouldReceive('distinct')->with('products.id')->andReturnSelf();
        $productModelMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Mocking the request
        $requestMock = m::mock();
        $requestMock->shouldReceive('input')->with('q')->andReturn('test');
        $requestMock->shouldReceive('input')->with('status')->andReturn([3, 4]);
        $requestMock->shouldReceive('input')->with('category_id')->andReturn([1, 2]);
        $requestMock->shouldReceive('input')->with('tags')->andReturn([5, 6]);
        $requestMock->shouldReceive('input')->with('condition')->andReturn([1, 2]);
        $requestMock->shouldReceive('input')->with('transaction_method')->andReturn([3, 4]);
        $requestMock->shouldReceive('input')->with('price_from')->andReturn(100);
        $requestMock->shouldReceive('input')->with('price_to')->andReturn(1000);
        $requestMock->shouldReceive('input')->with('date_from')->andReturn('01/01/2022');
        $requestMock->shouldReceive('input')->with('date_to')->andReturn('31/01/2022');

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $productModelMock);

        // Act
        $result = $this->repositoryMock->searchWithCriteria($requestMock, $limit);

        // Assert
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
