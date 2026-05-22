<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        return Comment::with(['user', 'post'])
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'post_id' => 'required|exists:posts,id'
        ]);

        $comment = Comment::create([
            'content' => $validated['content'],
            'post_id' => $validated['post_id'],
            'user_id' => auth()->id()
        ]);

        return response()->json($comment, 201);
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