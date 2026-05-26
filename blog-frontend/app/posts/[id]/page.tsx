"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";
import { useAuth } from "@/app/context/AuthContext";
import { likePost, unlikePost } from "@/services/like.service";
import { createComment } from "@/services/comment.service";

type Comment = {
    id: number;
    content: string;
    user: {
        name: string;
    };
};

type Post = {
    id: number;
    title: string;
    content: string;
    user: {
        name: string;
    };
    likes_count?: number;
    comments?: Comment[];
    is_liked?: boolean;
};

export default function PostDetailPage() {
    const { id } = useParams();
    const { token } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    const [comment, setComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);

    // =========================
    // FETCH POST
    // =========================
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);

                const res = await api.get(`/posts/${id}`);
                const data = res.data.data;

                setPost(data);
                setIsLiked(data.is_liked);
                setLikesCount(data.likes_count || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    // =========================
    // LIKE / UNLIKE
    // =========================
    const handleToggleLike = async () => {
        if (!post || loadingLike) return;

        try {
            setLoadingLike(true);

            // optimistic UI
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => prev + (isLiked ? -1 : 1));

            if (isLiked) {
                await unlikePost(post.id);
            } else {
                await likePost(post.id);
            }
        } catch (err) {
            console.error(err);

            // rollback
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => prev + (isLiked ? 1 : -1));
        } finally {
            setLoadingLike(false);
        }
    };

    // =========================
    // CREATE COMMENT
    // =========================
    const handleComment = async () => {
        if (!comment.trim() || !post || loadingComment) return;

        try {
            setLoadingComment(true);

            const newComment = await createComment({
                postId: post.id,
                content: comment,
            });

            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        comments: [
                            ...(prev.comments || []),
                            newComment,
                        ],
                    }
                    : prev
            );

            setComment("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingComment(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-8 space-y-4">
                <div className="h-6 w-1/2 bg-white/10 animate-pulse rounded" />
                <div className="h-32 bg-white/10 animate-pulse rounded" />
            </div>
        );
    }

    // =========================
    // NOT FOUND
    // =========================
    if (!post) {
        return (
            <div className="text-center text-zinc-400 mt-20">
                Post no encontrado
            </div>
        );
    }

    // =========================
    // UI
    // =========================
    return (
        <div className="max-w-2xl mx-auto px-6 py-10 text-white">

            {/* POST */}
            <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
                <h1 className="text-3xl font-bold">{post.title}</h1>

                <p className="mt-2 text-zinc-400">
                    by {post.user?.name}
                </p>

                <p className="mt-6 text-zinc-200 leading-relaxed">
                    {post.content}
                </p>

                <button
                    onClick={handleToggleLike}
                    disabled={loadingLike}
                    className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2 transition
                        ${isLiked ? "bg-red-500 text-white" : "bg-white/10 text-white"}
                    `}
                >
                    ❤️ {likesCount}
                </button>
            </div>

            {/* COMMENTS */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">
                    Comentarios
                </h2>

                {/* input */}
                <div className="flex gap-2 mb-6">
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribí un comentario..."
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none"
                    />

                    <button
                        onClick={handleComment}
                        disabled={loadingComment}
                        className="px-4 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-50"
                    >
                        {loadingComment ? "..." : "Enviar"}
                    </button>
                </div>

                {/* list */}
                <div className="space-y-3">
                    {post.comments?.length ? (
                        post.comments.map((c) => (
                            <div
                                key={c.id}
                                className="p-3 rounded-xl bg-white/5 border border-white/10"
                            >
                                <p className="text-sm text-zinc-400">
                                    {c.user?.name}
                                </p>

                                <p className="text-white">
                                    {c.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-zinc-500 text-sm">
                            Sin comentarios aún
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}