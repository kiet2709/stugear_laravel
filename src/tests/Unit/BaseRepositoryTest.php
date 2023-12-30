<?php


use App\Repositories\BaseRepository;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\TestCase;
use Mockery as m;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;

class BaseRepositoryTest extends TestCase
{
    protected $repositoryMock;

    public function setUp(): void
    {
        $this->repositoryMock = m::mock(BaseRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
    }

    // public function testGetByIdTraVeModelNeuTonTaiVaChuaXoa()
    // {
    //     // Tạo một đối tượng mô phỏng cho model (partial mock)
    //     $modelMock = m::mock(User::class)->makePartial();

    //     // Thiết lập kỳ vọng cho phương thức find
    //     $modelMock->shouldReceive('find')->with(1)->andReturn($modelMock);

    //     // Thiết lập kỳ vọng cho các phương thức khác có thể được gọi
    //     $modelMock->shouldReceive('setAttribute')->andReturnUsing(function ($key, $value) use ($modelMock) {
    //         $modelMock->$key = $value;
    //     });

    //     $modelMock->deleted_by = null;
    //     $modelMock->deleted_at = null;

    //     // Thiết lập thuộc tính model trong repository mock
    //     $this->setProperty($this->repositoryMock, 'model', $modelMock);

    //     // Gọi phương thức getById
    //     $result = $this->repositoryMock->getById(1);

    //     // Kiểm tra kết quả có phải là đối tượng model như kỳ vọng
    //     $this->assertEquals($modelMock, $result);
    // }

    // ... (các bài kiểm tra tương tự cho các tình huống khác)

    public function testGetByIdReturnsModelIfExistsAndNotDeleted()
    {
        // Tạo đối tượng mô phỏng cho model (partial mock)
        $modelMock = m::mock(User::class)->makePartial();

        // Thiết lập kỳ vọng cho phương thức find
        $modelMock->shouldReceive('find')->with(1)->andReturn($modelMock);

        // Thiết lập thuộc tính deleted_by và deleted_at để đảm bảo model không bị xóa
        $modelMock->deleted_by = null;
        $modelMock->deleted_at = null;

        // Thiết lập thuộc tính model trong repository mock
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Gọi phương thức getById
        $result = $this->repositoryMock->getById(1);

        // Kiểm tra kết quả có phải là đối tượng model như kỳ vọng
        $this->assertEquals($modelMock, $result);
    }

    public function testGetByIdReturnsFalseIfModelNotFound()
    {
        // Tạo đối tượng mô phỏng cho model (partial mock)
        $modelMock = m::mock(User::class)->makePartial();

        // Thiết lập kỳ vọng cho phương thức find
        $modelMock->shouldReceive('find')->with(1)->andReturnNull();

        // Thiết lập thuộc tính model trong repository mock
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Gọi phương thức getById
        $result = $this->repositoryMock->getById(1);

        // Kiểm tra kết quả có phải là false như kỳ vọng
        $this->assertFalse($result);
    }

    public function testGetByIdReturnsFalseIfModelIsDeleted()
    {
        // Tạo đối tượng mô phỏng cho model (partial mock)
        $modelMock = m::mock(User::class)->makePartial();

        // Thiết lập kỳ vọng cho phương thức find
        $modelMock->shouldReceive('find')->with(1)->andReturn($modelMock);

        // Thiết lập thuộc tính deleted_by hoặc deleted_at để đảm bảo model bị xóa
        $modelMock->deleted_by = 1;
        $modelMock->deleted_at = now();

        // Thiết lập thuộc tính model trong repository mock
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Gọi phương thức getById
        $result = $this->repositoryMock->getById(1);

        // Kiểm tra kết quả có phải là false như kỳ vọng
        $this->assertFalse($result);
    }

    public function testGetByIdReturnsFalseOnException()
    {
        // Mock Log facade
        Log::shouldReceive('error')->once();

        // Tạo đối tượng mô phỏng cho model (partial mock)
        $modelMock = m::mock(User::class)->makePartial();

        // Thiết lập kỳ vọng cho phương thức find
        $modelMock->shouldReceive('find')->with(1)->andThrow(new \Exception('Test Exception'));

        // Thiết lập thuộc tính model trong repository mock
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Gọi phương thức getById
        $result = $this->repositoryMock->getById(1);

        // Kiểm tra kết quả có phải là false như kỳ vọng
        $this->assertFalse($result);
    }

    //---------- kết thúc test 1 hàm

    public function testSaveCreatesNewModel()
    {
        // Arrange
        $attributes = ['name' => 'John Doe'];

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('create')->with($attributes)->andReturn($modelMock);

        // Mocking the DB facade
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->save($attributes);

        // Assert
        $this->assertEquals($modelMock, $result);
    }

    public function testSaveUpdatesExistingModel()
    {
        // Arrange
        $attributes = ['name' => 'Updated Name'];
        $id = 1;

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('find')->with($id)->andReturn($modelMock);
        $modelMock->shouldReceive('update')->with($attributes)->andReturn(true);

        // Mocking the DB facade
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->save($attributes, $id);

        // Assert
        $this->assertTrue($result);
    }

    public function testSaveRollsBackTransactionOnError()
    {
        // Arrange
        $attributes = ['name' => 'John Doe'];

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('create')->with($attributes)->andThrow(new \Exception('Test Exception'));

        // Mocking the DB facade
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('rollBack')->once();

        // Mocking the Log facade
        Log::shouldReceive('error')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->save($attributes);

        // Assert
        $this->assertFalse($result);
    }

    // kết thúc test 1 hàm


    public function testSaveManyCreatesNewModels()
    {
        // Arrange
        $attributes = [
            ['name' => 'John Doe'],
            ['name' => 'Jane Doe'],
        ];

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('save')->andReturn($modelMock);

        // Mocking the DB facade
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->saveMany($attributes);

        // Assert
        $this->assertCount(2, $result);
        $this->assertContains($modelMock, $result);
    }

    public function testSaveManyUpdatesExistingModels()
    {
        // Arrange
        $attributes = [
            ['name' => 'Updated Name 1'],
            ['name' => 'Updated Name 2'],
        ];
        $ids = [1, 2];

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('find')->with(1)->andReturn($modelMock);
        $modelMock->shouldReceive('find')->with(2)->andReturn($modelMock);
        $modelMock->shouldReceive('update')->andReturn(true);

        // Mocking the DB facade
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->saveMany($attributes, $ids);

        // Assert
        $this->assertTrue($result[0]);
        $this->assertTrue($result[1]);
    }

    public function testSaveManyRollsBackTransactionOnError()
    {
        // Arrange
        $attributes = [
            ['name' => 'John Doe'],
            ['name' => 'Jane Doe'],
        ];

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('save')->andThrow(new \Exception('Test Exception'));

        // Mocking the DB facade
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('rollBack')->once();

        // Mocking the Log facade
        Log::shouldReceive('error')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->saveMany($attributes);

        // Assert
        $this->assertFalse($result);
    }

    // kết thúc test 1 hàm


    public function testDeleteByIdReturnsTrueOnSuccess()
    {
        // Arrange
        $id = 1;

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('find')->with($id)->andReturn($modelMock);
        $modelMock->shouldReceive('setAttribute')->with('deleted_date', Mockery::type(Carbon::class));
        $modelMock->shouldReceive('save')->andReturn(true);

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->deleteById($id);

        // Assert
        $this->assertTrue($result);
    }

    public function testDeleteByIdReturnsFalseOnFailure()
    {
        // Arrange
        $id = 1;

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('find')->with($id)->andReturn($modelMock);
        $modelMock->shouldReceive('save')->andReturn(false);

        // Mocking the Log facade
        Log::shouldReceive('error')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->deleteById($id);

        // Assert
        $this->assertFalse($result);
    }


    // kết thúc 1 hàm test


    public function testGetAllReturnsPaginatorOnSuccess()
    {
        // Arrange
        $limit = 10;

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
        $modelMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
        $modelMock->shouldReceive('paginate')->with($limit)->andReturn(new LengthAwarePaginator([], 0, $limit));

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->getAll($limit);

        // Assert
        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    public function testGetAllReturnsFalseOnFailure()
    {
        // Arrange
        $limit = 10;

        // Mocking the model
        $modelMock = m::mock(User::class);
        $modelMock->shouldReceive('whereNull')->with('deleted_by')->andReturnSelf();
        $modelMock->shouldReceive('whereNull')->with('deleted_at')->andReturnSelf();
        $modelMock->shouldReceive('paginate')->with($limit)->andThrow(new \Exception('Test Exception'));

        // Mocking the Log facade
        Log::shouldReceive('error')->once();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $modelMock);

        // Act
        $result = $this->repositoryMock->getAll($limit);

        // Assert
        $this->assertFalse($result);
    }


    // Phương thức hỗ trợ để thiết lập thuộc tính bảo vệ/riêng tư trong một lớp
    protected function setProperty($object, $property, $value)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($property);
        $property->setAccessible(true);
        $property->setValue($object, $value);
    }
}
