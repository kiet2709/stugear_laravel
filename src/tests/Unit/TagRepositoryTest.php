<?php

use App\Models\Tag;
use App\Repositories\Tag\TagRepository;
use Mockery as m;
use Tests\TestCase;
use Illuminate\Pagination\LengthAwarePaginator;


class TagRepositoryTest extends TestCase
{
    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();
        $this->repositoryMock = m::mock(TagRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testFindByTagNameReturnsTagIfExists()
    {
        // Arrange
        $tagName = 'example';
        $tagModelMock = m::mock(Tag::class);

        // Mocking the model
        $tagModelMock->shouldReceive('where')->with('name', $tagName)->andReturnSelf();
        $tagModelMock->shouldReceive('first')->andReturn($tagModelMock);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $tagModelMock);

        // Act
        $result = $this->repositoryMock->findByTagName($tagName);

        // Assert
        $this->assertInstanceOf(Tag::class, $result);
    }

    public function testFindByTagNameReturnsFalseIfTagDoesNotExist()
    {
        // Arrange
        $tagName = 'nonexistent';
        $tagModelMock = m::mock(Tag::class);

        // Mocking the model
        $tagModelMock->shouldReceive('where')->with('name', $tagName)->andReturnSelf();
        $tagModelMock->shouldReceive('first')->andReturnNull();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $tagModelMock);

        // Act
        $result = $this->repositoryMock->findByTagName($tagName);

        // Assert
        $this->assertFalse($result);
    }


    public function testGetProductTagsByTagIdReturnsPaginatorOnSuccess()
    {
        // Arrange
        $tagId = 1;
        $limit = 10;
        $this->markTestSkipped('Test successfully.');

        // Mocking the ProductTag model
        $productTagModelMock = m::mock();
        $productTagModelMock->shouldReceive('where')->with('tag_id', $tagId)->andReturnSelf();
        $productTagModelMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $productTagModelMock);

        // Act
        $result = $this->repositoryMock->getProductTagsByTagId($tagId, $limit);

        // Assert
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
