<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    /**
     * Listar posts
     */
    public function index()
    {
        return PostResource::collection(
            Post::with(['user', 'comments', 'tags'])
                ->withCount('comments')
                ->latest()
                ->get()
        );
    }

    /**
     * Crear post
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => auth()->id()
        ]);

        return new PostResource(
            $post->load(['user', 'comments', 'tags'])
        );
    }

    /**
     * Ver post específico
     */
    public function show(string $id)
    {
        $post = Post::with(['user', 'comments', 'tags'])
            ->findOrFail($id);

        return new PostResource($post);
    }

    /**
     * Actualizar post
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $post->update($validated);

        return new PostResource(
            $post->load(['user', 'comments', 'tags'])
        );
    }

    /**
     * Eliminar post (soft delete)
     */
    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('delete', $post);

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ]);
    }
}