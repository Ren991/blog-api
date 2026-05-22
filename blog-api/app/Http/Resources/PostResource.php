<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,

            'user' => new UserResource($this->whenLoaded('user')),

            'comments_count' => $this->whenCounted('comments'),

            'comments' => CommentResource::collection(
                $this->whenLoaded('comments')
            ),
            'is_liked' => auth()->check()
                ? $this->likes->contains('user_id', auth()->id())
                : false,
            'created_at' => $this->created_at,
            'likes_count' => $this->whenCounted('likes'),
        ];
    }
}