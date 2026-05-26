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
    
    
    public function index(Request $request)
    {
        $query = Post::with([
                'user',
                'comments',
                'tags',
                'likes'
            ])
            ->withCount([
                'comments',
                'likes'
            ]);

        if ($request->has('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('title', 'like', "%{$search}%")
                ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $posts = $query
            ->latest()
            ->paginate(10);

        return PostResource::collection($posts);
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
        $post = Post::with([
            'user',
            'comments.user',
            'tags',
            'likes'
        ])
        ->withCount([
            'likes',
            'comments'
        ])
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