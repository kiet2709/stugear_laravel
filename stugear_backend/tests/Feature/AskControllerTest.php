<?php

namespace Tests\Feature;

use App\Models\Ask;
use App\Util\ImageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Mockery;
use Tests\TestCase;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
// use Illuminate\Foundation\Testing\DatabaseMigrations;
use App\Util\AppConstant;
use App\Repositories\Ask\AskRepository;

class AskControllerTest extends TestCase
{
    // use DatabaseMigrations;

    /**
     * @test
     * @skip
     */
    public function it_can_upload_an_image_successfully()
    {
        $credentials = [
            'email' => 'thanhtung_nguyen@gmail.com',
            'password' => 'password',
        ];

        // Thực hiện đăng nhập và lấy token
        if (!$token = JWTAuth::attempt($credentials)) {
            $this->fail('Failed to authenticate with the provided credentials.');
        }


        // Thêm token vào tiêu đề yêu cầu
        $headers = ['Authorization' => "Bearer $token"];

        $model = Ask::factory()->create();
        $image = UploadedFile::fake()->image('image.jpg');

        // Create a mock for ImageService
        $imageServiceMock = Mockery::mock('overload:' . ImageService::class);
        $imageServiceMock->shouldReceive('uploadImage')->andReturn('Upload successful message here');

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
        ->json('POST', "/api/asks/{$model->id}/upload-image", [
            'image' => $image,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Upload successful message here',
            ]);
    }

    /**
     * @test
     * @skip
     */
    public function it_handles_upload_failure()
    {
        $credentials = [
            'email' => 'thanhtung_nguyen@gmail.com',
            'password' => 'password',
        ];

        // Thực hiện đăng nhập và lấy token
        if (!$token = JWTAuth::attempt($credentials)) {
            $this->fail('Failed to authenticate with the provided credentials.');
        }


        // Thêm token vào tiêu đề yêu cầu
        $headers = ['Authorization' => "Bearer $token"];

        $model = Ask::factory()->create();
        $image = UploadedFile::fake()->image('image.jpg');

        // Create a mock for ImageService
        $imageServiceMock = Mockery::mock('overload:' . ImageService::class);
        $imageServiceMock->shouldReceive('uploadImage')->andReturn(AppConstant::$UPLOAD_FAILURE);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
        ->json('POST', "/api/asks/{$model->id}/upload-image", [
            'image' => $image,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'message' => AppConstant::$UPLOAD_FAILURE,
            ]);
    }


    /**
     * @test
     * @skip
     */
    public function it_handles_no_image_error()
    {
        $credentials = [
            'email' => 'thanhtung_nguyen@gmail.com',
            'password' => 'password',
        ];

        // Thực hiện đăng nhập và lấy token
        if (!$token = JWTAuth::attempt($credentials)) {
            $this->fail('Failed to authenticate with the provided credentials.');
        }


        // Thêm token vào tiêu đề yêu cầu
        $headers = ['Authorization' => "Bearer $token"];

        $model = Ask::factory()->create();
        $image = UploadedFile::fake()->image('image.jpg');

        // Create a mock for ImageService
        $imageServiceMock = Mockery::mock('overload:' . ImageService::class);
        $imageServiceMock->shouldReceive('uploadImage')->andReturn('Lỗi không có ảnh');

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
        ->json('POST', "/api/asks/{$model->id}/upload-image", [
            'image' => $image,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Lỗi không có ảnh',
            ]);
    }

    /**
     * @test
     * @skip
     */
    public function it_returns_default_image_when_no_image_id()
    {
        $this->markTestSkipped("Skip this test intentionally");
        // Mock AskRepository and ImageService
        $this->mockAskRepository(['image_id' => null]);

        // Call the route
        $response = $this->json('GET', "/api/asks/1/images");

        // Assert the response
        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'image/jpeg')
            ->assertSuccessful();
    }

    /**
     * @test
     * @skip
     */
    public function it_returns_image_from_path_when_path_contains_uploads()
    {
        $this->markTestSkipped("Skip this test intentionally");
        // Mock AskRepository and ImageService
        $this->mockAskRepository(['image_id' => 1]);

        // Call the route
        $response = $this->json('GET', "/api/asks/1/images");

        // Assert the response
        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'image/jpeg')
            ->assertSuccessful();
    }

    /**
     * @test
     * @skip
     */
    public function it_returns_json_message_when_path_does_not_contain_uploads()
    {
        $this->markTestSkipped("Skip this test intentionally");
        // Mock AskRepository and ImageService
        $this->mockAskRepository(['image_id' => 1]);

        // Call the route
        $response = $this->json('GET', "/api/asks/1/images");

    }

    private function mockAskRepository($attributes)
    {
        $askRepositoryMock = Mockery::mock('overload:' . AskRepository::class);
        $askRepositoryMock->shouldReceive('getById')->andReturn(new Ask($attributes));
        $this->app->instance(AskRepository::class, $askRepositoryMock);
    }




    // Clean up the mocks after each test
    protected function tearDown(): void
    {
        parent::tearDown();
        Mockery::close();
    }
}
