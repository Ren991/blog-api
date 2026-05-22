<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;

class LikeController extends Controller
{
    public function store($postId)
    {
        $post = Post::findOrFail($postId);

        $alreadyLiked = Like::where('user_id', auth()->id())
            ->where('post_id', $post->id)
            ->exists();

        if ($alreadyLiked) {
            return response()->json([
                'message' => 'Already liked'
            ], 409);
        }

        Like::create([
            'user_id' => auth()->id(),
            'post_id' => $post->id
        ]);

        return response()->json([
            'message' => 'Post liked'
        ]);
    }

    public function destroy($postId)
    {
        $like = Like::where('user_id', auth()->id())
            ->where('post_id', $postId)
            ->first();

        if (!$like) {
            return response()->json([
                'message' => 'Like not found'
            ], 404);
        }

        $like->delete();

        return response()->json([
            'message' => 'Like removed'
        ]);
    }
}