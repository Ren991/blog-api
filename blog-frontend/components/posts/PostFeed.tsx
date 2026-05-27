"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getPosts } from "@/services/post.service";
import PostCard from "./PostCard";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
  user: {
    name: string;
  };
  likes_count?: number;
  is_liked: boolean;
  comments_count?: number;
};

export default function PostFeed() {
  const { token } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const data = await getPosts(token);
        console.log(data)

        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  // 🔄 LOADING STATE (UX tipo Linear)
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 space-y-4">
        <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />

        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-white-400">
        {error}
      </div>
    );
  }

  // 📭 EMPTY STATE
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
        <p className="text-lg font-medium">No hay posts aún</p>
        <p className="text-sm">Sé el primero en publicar algo 🚀</p>
      </div>
    );
  }

  // 📌 FEED PRINCIPAL
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* HEADER FEED */}
      <Link
    href="/posts/create"
    className="px-4 py-2 rounded-xl bg-white text-black"
>
    + Crear post
</Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <p className="text-sm text-zinc-400">
          Últimas publicaciones de la comunidad
        </p>
      </div>

      {/* POSTS */}
      <div className="space-y-4">
        {posts ? posts.map((post) => (
          <PostCard key={post.id} post={post} />
        )) : <p className="text-sm">No hay posts disponibles para mostrar</p>}
      </div>
    </div>
  );
}