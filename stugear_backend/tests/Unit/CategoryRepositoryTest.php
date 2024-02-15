<?php

use App\Models\Category;
use App\Repositories\Category\CategoryRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery as m;
use PHPUnit\Framework\TestCase;

class CategoryRepositoryTest extends TestCase
{
    use RefreshDatabase; // Sử dụng trait RefreshDatabase để làm mới cơ sở dữ liệu (nếu cần)

    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();

        $this->repositoryMock = m::mock(CategoryRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testGetCategoryByIdReturnsCategoryIfExistsAndNotDirty()
    {
        // Arrange
        $id = 1;

        // Mocking the Category model
        $categoryModelMock = m::mock(Category::class);
        $categoryModelMock->shouldReceive('find')->with($id)->andReturn($categoryModelMock);
        $categoryModelMock->shouldReceive('isDirty')->with('deleted_by')->andReturn(false);
        $categoryModelMock->shouldReceive('isDirty')->with('deleted_at')->andReturn(false);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $categoryModelMock);

        // Act
        $result = $this->repositoryMock->getCategoryById($id);

        // Assert
        $this->assertInstanceOf(Category::class, $result);
    }

    public function testGetCategoryByIdReturnsFalseIfCategoryNotFound()
    {
        // Arrange
        $id = 1;

        // Mocking the Category model
        $categoryModelMock = m::mock(Category::class);
        $categoryModelMock->shouldReceive('find')->with($id)->andReturn(null);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $categoryModelMock);

        // Act
        $result = $this->repositoryMock->getCategoryById($id);

        // Assert
        $this->assertFalse($result);
    }

    public function testGetCategoryByIdReturnsFalseIfCategoryIsDirty()
    {
        // Arrange
        $id = 1;

        // Mocking the Category model
        $categoryModelMock = m::mock(Category::class);
        $categoryModelMock->shouldReceive('find')->with($id)->andReturn($categoryModelMock);
        $categoryModelMock->shouldReceive('isDirty')->with('deleted_by')->andReturn(true);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $categoryModelMock);

        // Act
        $result = $this->repositoryMock->getCategoryById($id);

        // Assert
        $this->assertFalse($result);
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
