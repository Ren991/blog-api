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

    $isFollowing = false;

    if (auth()->check()) {

        $isFollowing = auth()
            ->user()
            ->following()
            ->where(
                'following_id',
                $user->id
            )
            ->exists();
    }

    return response()->json([
        'user' => [
            'id' => $user->id,

            'name' => $user->name,

            'email' => $user->email,

            'avatar' => $user->avatar
                ? config('app.url') . '/storage/' . $user->avatar
                : null,

            'followers_count' => $user
                ->followers()
                ->count(),

            'following_count' => $user
                ->following()
                ->count(),

            'is_following' => $isFollowing,
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
            'avatar' => config('app.url') . '/storage/' . $path,

        ]);
    }

    public function updateName(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:50',
        ]);

        $user = auth()->user();

        // 🚨 regla: solo 1 vez
        if ($user->name_changed_at !== null) {
            return response()->json([
                'message' => 'El nombre solo puede cambiarse una vez'
            ], 403);
        }

        $user->update([
            'name' => $request->name,
            'name_changed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Nombre actualizado correctamente',
            'user' => $user,
        ]);
    }

    public function follow(User $user)
{
    if (auth()->id() === $user->id) {

        return response()->json([
            'message' => 'No puedes seguirte a ti mismo'
        ], 422);
    }

    auth()->user()
        ->following()
        ->syncWithoutDetaching([
            $user->id
        ]);

    return response()->json([
        'message' => 'Usuario seguido'
    ]);
}

    public function unfollow(User $user)
    {
        auth()->user()
            ->following()
            ->detach($user->id);

        return response()->json([
            'message' => 'Usuario dejado de seguir'
        ]);
    }
}