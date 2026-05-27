"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Heart,
  MessageCircle,
} from "lucide-react";

import {
  likePost,
  unlikePost,
} from "@/services/like.service";

import { useAuth } from "@/app/context/AuthContext";

type Tag = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  content: string;

  user: {
    name: string;
  };

  tags?: Tag[];

  likes_count?: number;
  comments_count?: number;

  is_liked: boolean;
};

export default function PostCard({
  post,
}: {
  post: Post;
}) {

  const { token } = useAuth();

  const [liked, setLiked] = useState(post.is_liked);

  const [likesCount, setLikesCount] = useState(
    post.likes_count || 0
  );

  const [loading, setLoading] = useState(false);

  // =========================
  // LIKE
  // =========================
  const handleLike = async () => {

    if (!token || loading) return;

    try {

      setLoading(true);

      // optimistic UI
      setLiked((prev) => !prev);

      setLikesCount((prev) =>
        liked ? prev - 1 : prev + 1
      );

      if (liked) {

        await unlikePost(post.id);

      } else {

        await likePost(post.id);
      }

    } catch (err) {

      console.error(err);

      // rollback
      setLiked((prev) => !prev);

      setLikesCount((prev) =>
        liked ? prev + 1 : prev - 1
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
        hover:bg-white/10
        transition
      "
    >

      {/* USER */}
      <div className="text-sm text-zinc-400">
        {post.user.name}
      </div>

      {/* TITLE */}
      <Link href={`/posts/${post.id}`}>

        <h2
          className="
            mt-2
            text-lg
            font-semibold
            hover:underline
          "
        >
          {post.title}
        </h2>

      </Link>

      {/* CONTENT */}
      <p
        className="
          mt-2
          text-sm
          text-zinc-300
          line-clamp-2
        "
      >
        {post.content}
      </p>

      {/* TAGS */}
      {post.tags && post.tags.length > 0 && (

        <div className="flex flex-wrap gap-2 mt-4">

          {post.tags.map((tag) => (

            <button
              key={tag.id}
              className="
                px-3 py-1
                rounded-full
                bg-white/10
                text-xs
                text-zinc-300
                hover:bg-white/20
                transition
              "
            >
              #{tag.name}
            </button>

          ))}

        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-5 mt-5">

        {/* LIKE */}
        <button
          onClick={handleLike}
          disabled={loading}
          className="
            flex items-center gap-2
            text-sm text-zinc-300
            hover:text-white
            transition
          "
        >

          <Heart
            size={18}
            className={
              liked
                ? "fill-red-500 text-red-500"
                : ""
            }
          />

          <span>
            {likesCount}
          </span>

        </button>

        {/* COMMENTS */}
        <div
          className="
            flex items-center gap-2
            text-sm text-zinc-300
          "
        >

          <MessageCircle size={18} />

          <span>
            {post.comments_count || 0}
          </span>

        </div>

        {/* DETAIL */}
        <Link
          href={`/posts/${post.id}`}
          className="
            ml-auto
            text-sm
            text-zinc-400
            hover:text-white
            transition
          "
        >
          Ver más →
        </Link>

      </div>

    </div>
  );
}