<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' =>$this->email,
            'avatar' => $this->avatar
            ? config('app.url') . '/storage/' . $this->avatar
            : null,
            'name_changed_at' => $this->name_changed_at,

            'followers_count' => $this->followers()->count(),
            'following_count' => $this->following()->count(),

            'is_following' => auth()->check()
                ? auth()->user()->following()
                    ->where('following_id', $this->id)
                    ->exists()
                : false,
        ];
    }
}