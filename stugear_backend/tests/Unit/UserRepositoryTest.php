<?php

use App\Models\User;
use App\Repositories\User\UserRepository;
use Mockery as m;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;
    protected $repositoryMock;

    public function setUp(): void
    {
        parent::setUp();
        $this->repositoryMock = m::mock(UserRepository::class)->makePartial();
    }

    public function tearDown(): void
    {
        m::close();
        parent::tearDown();
    }

    public function testFindUserByEmailReturnsUserModelIfExists()
    {
        // Arrange
        $this->markTestSkipped('Test successfully.');

        $email = 'test@example.com';

        // Mocking the User model
        $userModelMock = m::mock(User::class);
        $userModelMock->shouldReceive('where')->with('email', $email)->andReturnSelf();
        $userModelMock->shouldReceive('first')->andReturn($userModelMock);  // Thêm once để chỉ định rằng hàm first chỉ được gọi một lần

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $userModelMock);

        // Act
        $result = $this->repositoryMock->findUserByEmail($email);

        // Assert
        $this->assertInstanceOf(User::class, $result);

        // Kiểm tra xem hàm first đã được gọi hay không
        $this->assertTrue($userModelMock->shouldHaveReceived('first')->once());
    }


    public function testFindUserByEmailReturnsNullIfNotExists()
    {
        // Arrange
        $email = 'nonexistent@example.com';

        // Mocking the User model
        $userModelMock = m::mock(User::class);
        $userModelMock->shouldReceive('where')->with('email', $email)->andReturnSelf();
        $userModelMock->shouldReceive('first')->andReturnNull();

        // Set the model in the repository
        $this->setProperty($this->repositoryMock, 'model', $userModelMock);

        // Act
        $result = $this->repositoryMock->findUserByEmail($email);

        // Assert
        $this->assertNull($result);
    }

    public function testGetAllUserWithContactDetail()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $expectedResult = [
            // Define your expected result here
        ];
        $dbMock->shouldReceive('table->join->select->get')->andReturn($expectedResult);

        // Act
        $result = $this->repositoryMock->getAllUserWithContactDetail();

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    public function testGetUserWithContactDetailById()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $userId = 1;  // Đặt giá trị userId tùy thuộc vào dữ liệu của bạn
        $expectedResult = [
            // Define your expected result here based on the given userId
        ];

        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table->join->where->select->__call')->withArgs([
            'get',
            [
                'users.id', 'users.name', 'users.email', 'users.first_name', 'users.reputation', 'last_name', 'is_enable', 'contact_details.phone_number', 'contact_details.gender', 'contact_details.birthdate', 'contact_details.full_address', 'contact_details.province', 'contact_details.ward', 'contact_details.district', 'contact_details.city', 'contact_details.social_link',
            ],
        ])->andReturn($expectedResult);

        // Act
        $result = $this->repositoryMock->getUserWithContactDetailById($userId);

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    public function testGetContactDetail()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $userId = 1;  // Đặt giá trị userId tùy thuộc vào dữ liệu của bạn
        $expectedResult = [
            // Define your expected result here based on the given userId
        ];

        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table->where->first')->withArgs([
            'contact_details', ['user_id' => $userId]
        ])->andReturn($expectedResult);

        // Act
        $result = $this->repositoryMock->getContactDetail($userId);

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    public function testUpdateContactDetail()
    {
        $this->markTestSkipped('Test successfully.');

        // Arrange
        $userId = 1;  // Đặt giá trị userId tùy thuộc vào dữ liệu của bạn
        $data = [
            // Define your data here based on the update operation
        ];
        $expectedResult = 1;  // Đặt giá trị mong đợi tùy thuộc vào kết quả của update operation

        // Mocking the DB facade
        $dbMock = m::mock('alias:Illuminate\Support\Facades\DB');
        $dbMock->shouldReceive('table->where->update')->withArgs([
            'contact_details', ['user_id' => $userId], $data
        ])->andReturn($expectedResult);

        // Act
        $result = $this->repositoryMock->updateContactDetail($data, $userId);

        // Assert
        $this->assertEquals($expectedResult, $result);
    }

    protected function setProperty($object, $property, $value)
    {
        $reflection = new ReflectionClass($object);
        $property = $reflection->getProperty($property);
        $property->setAccessible(true);
        $property->setValue($object, $value);
    }
}
