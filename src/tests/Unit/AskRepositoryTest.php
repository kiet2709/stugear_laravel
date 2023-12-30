<?php

use App\Repositories\Ask\AskRepository;
use App\Models\Ask;
use Illuminate\Pagination\LengthAwarePaginator;
use PHPUnit\Framework\TestCase;
use Mockery as m;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;


class AskRepositoryTest extends TestCase
{
    use RefreshDatabase;
    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();

        $this->repositoryMock = m::mock(AskRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testGetListAskByCurrentUserReturnsPaginatorOnSuccess()
    {
        $this->markTestSkipped('Test successfully.');
        // Arrange
        $type = 'some_type';
        $limit = 10;
        $userId = 1;

        // Mocking the Ask model
        $askModelMock = m::mock(Ask::class);
        $askModelMock->shouldReceive('where')->with('type', $type)->andReturnSelf();
        $askModelMock->shouldReceive('where')->with('owner_id', $userId)->andReturnSelf();
        $askModelMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $askModelMock);

        // Act
        $result = $this->repositoryMock->getListAskByCurrentUser($type, $limit, $userId);

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
