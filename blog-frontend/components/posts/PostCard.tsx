import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
  user: { name: string };
  likes_count?: number;
  comments_count?: number;
};

export default function PostCard({ post }: { post: Post }) {
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
      <div className="mt-4 flex gap-4 text-sm text-zinc-400">
        <button>❤️ {post.likes_count ?? 0}</button>
        <span>💬 {post.comments_count ?? 0}</span>
        <Link href={`/posts/${post.id}`} className="ml-auto">
          Ver más →
        </Link>
      </div>
    </div>
  );
}