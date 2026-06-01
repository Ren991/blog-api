<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\PostResource;

class UserController extends Controller
{
    public function profile($id)
    {
        $user = User::findOrFail($id);

        $posts = $user->posts()
            ->with([
                'user',
                'tags',
                'likes',
                'comments.user'
            ])
            ->withCount([
                'likes',
                'comments'
            ])
            ->latest()
            ->get();

        $likesReceived = $posts->sum('likes_count');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],

            'stats' => [
                'posts' => $posts->count(),
                'likes_received' => $likesReceived,
            ],

            'posts' => PostResource::collection($posts),
        ]);
    }
}