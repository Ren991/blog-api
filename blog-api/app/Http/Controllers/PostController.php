<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;

use Illuminate\Http\Request;

use App\Http\Resources\PostResource;

class PostController extends Controller
{
    /**
     * =========================
     * LIST POSTS
     * =========================
     */
    public function index(Request $request)
    {
        $query = Post::with([
                'user',
                'comments.user',
                'tags',
                'likes'
            ])
            ->withCount([
                'comments',
                'likes'
            ]);

        /**
         * =========================
         * SEARCH
         * =========================
         */
        if ($request->has('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        /**
         * =========================
         * FILTER BY TAG
         * =========================
         */
        if ($request->has('tag')) {

            $tag = strtolower($request->tag);

            $query->whereHas('tags', function ($q) use ($tag) {

                $q->where('name', $tag);
            });
        }

        /**
         * =========================
         * ORDER + PAGINATION
         * =========================
         */
        $posts = $query
            ->latest()
            ->paginate(10);

        return PostResource::collection($posts);
    }

    /**
     * =========================
     * CREATE POST
     * =========================
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',

            // tags opcionales
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        /**
         * =========================
         * CREATE POST
         * =========================
         */
        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => auth()->id(),
        ]);

        /**
         * =========================
         * CREATE / ATTACH TAGS
         * =========================
         */
        if ($request->has('tags')) {

            $tagIds = [];

            foreach ($request->tags as $tagName) {

                $tag = Tag::firstOrCreate([
                    'name' => strtolower(trim($tagName))
                ]);

                $tagIds[] = $tag->id;
            }

            $post->tags()->sync($tagIds);
        }

        return new PostResource(
            $post->load([
                'user',
                'comments.user',
                'tags',
                'likes'
            ])
        );
    }

    /**
     * =========================
     * SHOW POST
     * =========================
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
     * =========================
     * UPDATE POST
     * =========================
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',

            // tags opcionales
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        /**
         * =========================
         * UPDATE POST DATA
         * =========================
         */
        $post->update([
            'title' => $validated['title'] ?? $post->title,
            'content' => $validated['content'] ?? $post->content,
        ]);

        /**
         * =========================
         * UPDATE TAGS
         * =========================
         */
        if ($request->has('tags')) {

            $tagIds = [];

            foreach ($request->tags as $tagName) {

                $tag = Tag::firstOrCreate([
                    'name' => strtolower(trim($tagName))
                ]);

                $tagIds[] = $tag->id;
            }

            $post->tags()->sync($tagIds);
        }

        return new PostResource(
            $post->load([
                'user',
                'comments.user',
                'tags',
                'likes'
            ])
        );
    }

    /**
     * =========================
     * DELETE POST
     * =========================
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