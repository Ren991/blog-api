<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
                'avatar' => $user->avatar
                    ? asset('storage/' . $user->avatar)
                    : null,
            ],

            'stats' => [
                'posts' => $posts->count(),
                'likes_received' => $likesReceived,
            ],

            'posts' => PostResource::collection($posts),
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = auth()->user();

        // eliminar avatar anterior
        if ($user->avatar) {
            Storage::disk('public')->delete(
                $user->avatar
            );
        }

        $path = $request
            ->file('avatar')
            ->store('avatars', 'public');

        $user->update([
            'avatar' => $path,
        ]);

        return response()->json([
            'avatar' => asset('storage/' . $path),
        ]);
    }
}