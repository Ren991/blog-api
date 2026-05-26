import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost } from "@/services/like.service";
import { useAuth } from "@/app/context/AuthContext";

type Post = {
  id: number;
  title: string;
  content: string;
  user: { name: string };
  likes_count?: number;
  is_liked:boolean;
  comments_count?: number;
};

export default function PostCard({ post }: { post: Post }) {
   const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
    const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);

        await unlikePost(post.id);
      } else {
        setLiked(true);
        setLikesCount((prev) => prev + 1);

        await likePost(post.id );
      }
    } catch (err) {
      // rollback si falla
      setLiked(!liked);
      setLikesCount((prev) =>
        liked ? prev + 1 : prev - 1
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl hover:bg-white/10 transition">
      
      <div className="text-sm text-zinc-400">
        {post.user.name}
      </div>

      <Link href={`/posts/${post.id}`}>
        <h2 className="mt-2 text-lg font-semibold hover:underline">
          {post.title}
        </h2>
      </Link>

      <p className="mt-2 text-sm text-zinc-300 line-clamp-2">
        {post.content}
      </p>

      {/* actions */}
      {/* <div className="mt-4 flex gap-4 text-sm text-zinc-400">
        <button>❤️ {post.likes_count ?? 0}</button>
        <span>💬 {post.comments_count ?? 0}</span>
        <Link href={`/posts/${post.id}`} className="ml-auto">
          Ver más →
        </Link>
      </div> */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-2 text-sm"
        >
          <Heart
            size={18}
            className={
              liked ? "fill-red-500 text-red-500" : ""
            }
          />

          {likesCount}
        </button>
      </div>
    </div>
  );
}