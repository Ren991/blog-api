<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Resources\CommentResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class CommentController extends Controller
{
    public function index()
    {
        return CommentResource::collection(
            Comment::with(['user', 'post'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'post_id' => 'required|exists:posts,id'
        ]);

        /**
         * =========================
         * RATE LIMITING
         * =========================
         */

        $userId = auth()->id();

        $key = "comments:{$userId}:" . now()->format('Y-m-d-H');

        $count = Cache::get($key, 0);

        if ($count >= 1) {
            return response()->json([
                'message' => 'Límite de 20 comentarios por hora alcanzado'
            ], 429);
        }

        Cache::put($key, $count + 1, now()->addHour());

        $comment = Comment::create([
            'content' => $validated['content'],
            'post_id' => $validated['post_id'],
            'user_id' => auth()->id()
        ]);

        $comment->load(['user', 'post']);

        return new CommentResource($comment);
    }

    public function show(string $id)
    {
        return Comment::with(['user', 'post'])->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);

        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment->update($validated);

        return response()->json($comment);
    }

    public function destroy(string $id)
    {
        $comment = Comment::findOrFail($id);

        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted'
        ]);
    }
}