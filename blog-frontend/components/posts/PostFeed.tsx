"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getPosts } from "@/services/post.service";
import PostCard from "./PostCard";
import FeedToolbar from "../feed/FeedToolbar";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  likes_count?: number;
  is_liked: boolean;
  comments_count?: number;
};

export default function PostFeed() {
  const { token } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest"); // 🔥 NUEVO

  const observer = useRef<IntersectionObserver | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // =========================
  // RESET (search OR sort change)
  // =========================
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [search, sort]);

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = useCallback(
    async (pageNumber: number, searchValue: string, sortValue: string) => {
      if (!token) return;
      if (loading) return;

      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);

        const data = await getPosts(
          pageNumber,
          searchValue,
          sortValue,
          controller.signal
        );

        setPosts((prev) =>
          pageNumber === 1 ? data.data : [...prev, ...data.data]
        );

        setHasMore(pageNumber < data.last_page);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [token, loading]
  );

  // =========================
  // EFFECT FETCH
  // =========================
  useEffect(() => {
    if (!token) return;

    fetchPosts(page, search, sort);
  }, [page, search, sort, token]);

  // =========================
  // INFINITE SCROLL
  // =========================
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  // =========================
  // UI
  // =========================
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">

      {/* 🔥 TOOLBAR (search + sort) */}
      <FeedToolbar
        onSearch={setSearch}
        sort={sort}
        onSort={setSort}
      />

      <h1 className="text-2xl font-bold mb-6">Feed</h1>

      <div className="space-y-4">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;

          return (
            <div key={post.id} ref={isLast ? lastPostRef : null}>
              <PostCard post={post} />
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-zinc-400 mt-6">
          Cargando más posts...
        </p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-zinc-500 mt-6">
          No hay más posts
        </p>
      )}
    </div>
  );
}