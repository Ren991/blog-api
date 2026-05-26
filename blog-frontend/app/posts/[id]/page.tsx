"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

import { api } from "@/services/api";
import { useAuth } from "@/app/context/AuthContext";

import { likePost, unlikePost } from "@/services/like.service";
import {
    createComment,
    deleteComment,
    updateComment,
} from "@/services/comment.service";

type Comment = {
    id: number;
    content: string;
    user?: {
        id: number;
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
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    const [comment, setComment] = useState("");

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loadingLike, setLoadingLike] = useState(false);

    const [loadingComment, setLoadingComment] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

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
    // LIKE
    // =========================
    const handleToggleLike = async () => {
        if (!post || loadingLike) return;

        try {
            setLoadingLike(true);

            setIsLiked((prev) => !prev);
            setLikesCount((prev) => prev + (isLiked ? -1 : 1));

            if (isLiked) {
                await unlikePost(post.id);
            } else {
                await likePost(post.id);
            }
        } catch (err) {
            console.error(err);

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

            Swal.fire({
                icon: "success",
                title: "Comentario creado",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingComment(false);
        }
    };

    // =========================
    // DELETE COMMENT (CONFIRMADO)
    // =========================
    const handleDelete = async (commentId: number) => {
        const confirm = await Swal.fire({
            title: "¿Desea eliminar el comentario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No",
        });

        if (!confirm.isConfirmed) return;

        try {
            await deleteComment(commentId);

            setPost((prev) =>
                prev
                    ? {
                          ...prev,
                          comments: prev.comments?.filter(
                              (c) => c.id !== commentId
                          ),
                      }
                    : prev
            );

            Swal.fire({
                icon: "success",
                title: "Comentario eliminado",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
        }
    };

    // =========================
    // EDIT COMMENT
    // =========================
    const handleEdit = (c: Comment) => {
        setEditingId(c.id);
        setEditText(c.content);
    };

    const handleUpdate = async (id: number) => {
        try {
            const updated = await updateComment(id, editText);

            setPost((prev) =>
                prev
                    ? {
                          ...prev,
                          comments: prev.comments?.map((c) =>
                              c.id === id ? updated : c
                          ),
                      }
                    : prev
            );

            setEditingId(null);
            setEditText("");

            Swal.fire({
                icon: "success",
                title: "Comentario editado",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
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

                <p className="mt-6 text-zinc-200">
                    {post.content}
                </p>

                <button
                    onClick={handleToggleLike}
                    disabled={loadingLike}
                    className={`mt-4 px-4 py-2 rounded-xl transition
                        ${isLiked ? "bg-red-500" : "bg-white/10"}
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
                        className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
                    />

                    <button
                        onClick={handleComment}
                        disabled={loadingComment}
                        className="px-4 py-2 bg-white text-black rounded-xl"
                    >
                        Enviar
                    </button>
                </div>

                {/* list */}
                <div className="space-y-3">
                    {post.comments?.map((c) => (
                        <div
                            key={c.id}
                            className="p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                            <p className="text-sm text-zinc-400">
                                {c.user?.name ?? "Usuario"}
                            </p>

                            {editingId === c.id ? (
                                <div className="flex gap-2 mt-2">
                                    <input
                                        value={editText}
                                        onChange={(e) =>
                                            setEditText(e.target.value)
                                        }
                                        className="flex-1 bg-white/10 px-2 py-1 rounded"
                                    />

                                    <button
                                        onClick={() =>
                                            handleUpdate(c.id)
                                        }
                                        className="text-green-400"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            ) : (
                                <p className="text-white mt-1">
                                    {c.content}
                                </p>
                            )}

                            {/* actions */}
                            {user?.id === c.user?.id &&
                                editingId !== c.id && (
                                    <div className="flex gap-3 mt-2 text-sm">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="text-blue-400"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(c.id)
                                            }
                                            className="text-red-400"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}