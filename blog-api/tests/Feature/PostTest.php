<?php

namespace Tests\Feature;

use Tests\TestCase;

use App\Models\Post;
use App\Models\User;
use App\Models\Tag;
use App\Models\Like;

use Laravel\Sanctum\Sanctum;

use Illuminate\Foundation\Testing\RefreshDatabase;
CONST POST_ROUTE = '/api/posts';

class PostTest extends TestCase
{
    use RefreshDatabase;

    /**
     * =========================
     * LIST POSTS
     * =========================
     */
    public function test_can_list_posts(): void
    {
        Post::factory()->count(3)->create();

        $response = $this->getJson(POST_ROUTE);

        $response->assertStatus(200);
    }

    /**
     * =========================
     * SHOW POST
     * =========================
     */
    public function test_can_show_single_post(): void
    {
        $post = Post::factory()->create();

        $response = $this->getJson(
            POST_ROUTE . "/{$post->id}"
        );

        $response->assertStatus(200);
    }

    /**
     * =========================
     * CREATE POST
     * =========================
     */
    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson(
            POST_ROUTE,
            [
                'title' => 'Mi Post',
                'content' => 'Contenido test',
            ]
        );

        $response->assertStatus(201);

        $this->assertDatabaseHas(
            'posts',
            [
                'title' => 'Mi Post'
            ]
        );
    }

    /**
     * =========================
     * GUEST CREATE POST
     * =========================
     */
    public function test_guest_cannot_create_post(): void
    {
        $response = $this->postJson(
            POST_ROUTE,
            [
                'title' => 'Test',
                'content' => 'Contenido'
            ]
        );

        $response->assertStatus(401);
    }

    /**
     * =========================
     * UPDATE OWN POST
     * =========================
     */
    public function test_owner_can_update_post(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $post = Post::factory()->create([
            'user_id' => $user->id
        ]);

        $response = $this->putJson(
            POST_ROUTE . "/{$post->id}",
            [
                'title' => 'Nuevo titulo'
            ]
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas(
            'posts',
            [
                'id' => $post->id,
                'title' => 'Nuevo titulo'
            ]
        );
    }

    /**
     * =========================
     * UPDATE OTHER POST
     * =========================
     */
    public function test_user_cannot_update_other_post(): void
    {
        $owner = User::factory()->create();

        $other = User::factory()->create();

        Sanctum::actingAs($other);

        $post = Post::factory()->create([
            'user_id' => $owner->id
        ]);

        $response = $this->putJson(
            POST_ROUTE . "/{$post->id}",
            [
                'title' => 'Hack'
            ]
        );

        $response->assertStatus(403);
    }

    /**
     * =========================
     * DELETE OWN POST
     * =========================
     */
    public function test_owner_can_delete_post(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $post = Post::factory()->create([
            'user_id' => $user->id
        ]);

        $response = $this->deleteJson(
            POST_ROUTE . "/{$post->id}"
        );

        $response->assertStatus(200);

        $this->assertDatabaseMissing(
            'posts',
            [
                'id' => $post->id
            ]
        );
    }

    /**
     * =========================
     * DELETE OTHER POST
     * =========================
     */
    public function test_user_cannot_delete_other_post(): void
    {
        $owner = User::factory()->create();

        $other = User::factory()->create();

        Sanctum::actingAs($other);

        $post = Post::factory()->create([
            'user_id' => $owner->id
        ]);

        $response = $this->deleteJson(
            POST_ROUTE . "/{$post->id}"
        );

        $response->assertStatus(403);
    }

    /**
     * =========================
     * SEARCH TITLE
     * =========================
     */
    public function test_can_search_post_by_title(): void
    {
        Post::factory()->create([
            'title' => 'Laravel Testing'
        ]);

        Post::factory()->create([
            'title' => 'React'
        ]);

        $response = $this->getJson(
            POST_ROUTE . '?search=Laravel'
        );

        $response->assertStatus(200);

        $response->assertSee('Laravel');
    }

    /**
     * =========================
     * SEARCH TAG
     * =========================
     */
    public function test_can_search_post_by_tag(): void
    {
        $tag = Tag::create([
            'name' => 'php'
        ]);

        $post = Post::factory()->create();

        $post->tags()->attach($tag);

        $response = $this->getJson(
            POST_ROUTE . '?search=%23php'
        );

        $response->assertStatus(200);
    }

    /**
     * =========================
     * FILTER TAG
     * =========================
     */
    public function test_can_filter_posts_by_tag(): void
    {
        $tag = Tag::create([
            'name' => 'laravel'
        ]);

        $post = Post::factory()->create();

        $post->tags()->attach($tag);

        $response = $this->getJson(
            POST_ROUTE . '?tag=laravel'
        );

        $response->assertStatus(200);
    }

    /**
     * =========================
     * PAGINATION
     * =========================
     */
    public function test_posts_are_paginated(): void
    {
        Post::factory()
            ->count(30)
            ->create();

        $response = $this->getJson(
            POST_ROUTE . '?page=1'
        );

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data',
            'links',
            'meta'
        ]);
    }

    /**
     * =========================
     * LIKE POST
     * =========================
     */
    public function test_user_can_like_post(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $post = Post::factory()->create();

        $response = $this->postJson(
            POST_ROUTE . "/{$post->id}/like"
        );

        $response->assertStatus(200);
    }

    /**
     * =========================
     * UNLIKE POST
     * =========================
     */
    public function test_user_can_unlike_post(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $post = Post::factory()->create();

        Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id
        ]);

        $response = $this->deleteJson(
            POST_ROUTE . "/{$post->id}/like"
        );

        $response->assertStatus(200);
    }

    /**
     * =========================
     * POSTS HAVE COMMENTS COUNT
     * =========================
     */
    public function test_post_response_contains_comments_count(): void
    {
        $post = Post::factory()->create();

        $response = $this->getJson(
            POST_ROUTE . "/{$post->id}"
        );

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'data' => [
                'comments_count'
            ]
        ]);
    }
}