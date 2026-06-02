<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    /**
     * =========================
     * LIST POSTS
     * =========================
     */
    public function index(Request $request)
{
    $query = $this->buildQuery();

    $this->applySearch(
        $query,
        $request->input('search')
    );

    $this->applyTagFilter(
        $query,
        $request->input('tag')
    );

    $this->applySorting(
        $query,
        $request->input('sort', 'latest')
    );

    $posts = $query->paginate(10);

    return response()->json([
        'data' => PostResource::collection($posts),
        'current_page' => $posts->currentPage(),
        'last_page' => $posts->lastPage(),
        'total' => $posts->total(),
    ]);
}

private function buildQuery()
{
    return Post::with([
        'user',
        'comments.user',
        'comments.replies.user',
        'tags',
        'likes'
    ])->withCount([
        'comments',
        'likes'
    ]);
}

private function applySearch($query, ?string $search): void
{
    if (!$search) {
        return;
    }

    [$textWords, $tags] = $this->parseSearch(
        trim($search)
    );

    $this->applyTextSearch(
        $query,
        $textWords
    );

    $this->applyTagSearch(
        $query,
        $tags
    );
}

private function parseSearch(string $search): array
{
    $words = preg_split('/\s+/', $search);

    $tags = [];
    $textWords = [];

    foreach ($words as $word) {

        $word = trim($word);

        if (!$word) {
            continue;
        }

        if (str_starts_with($word, '#')) {

            $tag = strtolower(
                ltrim($word, '#')
            );

            if ($tag !== '') {
                $tags[] = $tag;
            }

        } else {

            $textWords[] = $word;
        }
    }

    return [
        $textWords,
        $tags
    ];
}

private function applyTextSearch(
    $query,
    array $textWords
): void
{
    if (empty($textWords)) {
        return;
    }

    $query->where(function ($q) use ($textWords) {

        foreach ($textWords as $word) {

            $q->where(function ($sub) use ($word) {

                $sub->where(
                    'title',
                    'like',
                    "%{$word}%"
                )->orWhere(
                    'content',
                    'like',
                    "%{$word}%"
                );
            });
        }
    });
}

private function applyTagSearch(
    $query,
    array $tags
): void
{
    foreach ($tags as $tag) {

        $query->whereHas(
            'tags',
            fn ($q) => $q->where(
                'name',
                $tag
            )
        );
    }
}

private function applyTagFilter(
    $query,
    ?string $tag
): void
{
    if (!$tag) {
        return;
    }

    $query->whereHas(
        'tags',
        fn ($q) => $q->where(
            'name',
            strtolower($tag)
        )
    );
}

private function applySorting(
    $query,
    string $sort
): void
{
    match ($sort) {

        'liked' =>
            $query->orderBy(
                'likes_count',
                'desc'
            ),

        'relevant' =>
            $query->orderByRaw(
                '(likes_count * 2 + comments_count) DESC'
            ),

        default =>
            $query->orderBy(
                'created_at',
                'desc'
            ),
    };
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
         * RATE LIMITE
         * =========================
         */
        $userId = auth()->id();

        $key = "posts:{$userId}:" . now()->format('Y-m-d');

        $count = Cache::get($key, 0);

        if ($count >= 10) {
            return response()->json([
                'message' => 'Límite de 20 posts por día alcanzado'
            ], 429);
        }

        Cache::put($key, $count + 1, now()->addDay());

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
                'comments.replies.user',
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