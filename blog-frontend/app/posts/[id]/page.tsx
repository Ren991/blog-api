"use client";

import { useEffect, useState } from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import Swal from "sweetalert2";

import Link from "next/link";

import {
    Pencil,
    Trash2,
    Check,
    ArrowLeft,
} from "lucide-react";

import { api } from "@/services/api";

import { useAuth } from "@/app/context/AuthContext";

import {
    likePost,
    unlikePost,
} from "@/services/like.service";

import {
    createComment,
    deleteComment,
    updateComment,
} from "@/services/comment.service";

import {
    deletePost,
} from "@/services/post.service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Comment = {
    id: number;
    content: string;
    created_at: string;

    parent_id?: number | null;

    replies?: Comment[];

    user?: {
        id: number;
        name: string;
    };
};

type Tag = {
    id: number;
    name: string;
};

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

    tags?: Tag[];

    likes_count?: number;

    comments?: Comment[];

    is_liked?: boolean;
};

export default function PostDetailPage() {

    const { id } = useParams();

    const router = useRouter();

    const { user } = useAuth();

    const [post, setPost] =
        useState<Post | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [comment, setComment] =
        useState("");

    const [isLiked, setIsLiked] =
        useState(false);

    const [likesCount, setLikesCount] =
        useState(0);

    const [loadingLike, setLoadingLike] =
        useState(false);

    const [loadingComment, setLoadingComment] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [editText, setEditText] =
        useState("");

    // =========================
    // REPLIES
    // =========================
    const [replyingTo, setReplyingTo] =
        useState<number | null>(null);

    const [replyText, setReplyText] =
        useState("");

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
    // DELETE POST
    // =========================
    const handleDeletePost = async () => {

        if (!post) return;

        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Este post será eliminado permanentemente",
            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar",

            reverseButtons: true,
        });

        if (!confirm.isConfirmed) return;

        try {

            await deletePost(post.id);

            await Swal.fire({
                icon: "success",
                title: "Post eliminado",
                timer: 1200,
                showConfirmButton: false,
            });

            router.push("/");

        } catch (err) {

            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Error eliminando post",
            });
        }
    };

    // =========================
    // LIKE
    // =========================
    const handleToggleLike = async () => {

        if (!post || loadingLike) return;

        try {

            setLoadingLike(true);

            setIsLiked((prev) => !prev);

            setLikesCount((prev) =>
                prev + (isLiked ? -1 : 1)
            );

            if (isLiked) {

                await unlikePost(post.id);

            } else {

                await likePost(post.id);
            }

        } catch (err) {

            console.error(err);

            setIsLiked((prev) => !prev);

            setLikesCount((prev) =>
                prev + (isLiked ? 1 : -1)
            );

        } finally {

            setLoadingLike(false);
        }
    };

    // =========================
    // CREATE COMMENT
    // =========================
    const handleComment = async () => {

        if (
            !comment.trim() ||
            !post ||
            loadingComment
        ) return;

        try {

            setLoadingComment(true);

            const newComment =
                await createComment({
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

        } catch (err: any) {

            const message =
                err.response?.data?.message ||
                "Error al crear comentario";

            Swal.fire({
                icon: "error",
                title: message,
            });

        } finally {

            setLoadingComment(false);
        }
    };

    // =========================
    // CREATE REPLY
    // =========================
    const handleReply = async (
        parentId: number
    ) => {

        if (!replyText.trim() || !post)
            return;

        try {

            const newReply =
                await createComment({
                    postId: post.id,
                    content: replyText,
                    parentId,
                });

            setPost((prev) => {

                if (!prev) return prev;

                return {
                    ...prev,

                    comments:
                        prev.comments?.map((c) => {

                            if (c.id !== parentId)
                                return c;

                            return {
                                ...c,

                                replies: [
                                    ...(c.replies || []),
                                    newReply,
                                ],
                            };
                        }),
                };
            });

            setReplyText("");

            setReplyingTo(null);

        } catch (err) {

            console.error(err);
        }
    };

    // =========================
    // DELETE COMMENT
    // =========================
    const handleDelete = async (
        commentId: number
    ) => {

        const confirm = await Swal.fire({
            title: "¿Eliminar comentario?",
            icon: "warning",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        try {

            await deleteComment(commentId);

            setPost((prev) => {

                if (!prev) return prev;

                return {

                    ...prev,

                    comments: prev.comments?.filter(
                        (c) => c.id !== commentId
                    ).map((c) => ({

                        ...c,

                        replies: c.replies?.filter(
                            (r) => r.id !== commentId
                        ) || [],
                    })),
                };
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

    const handleUpdate = async (
        id: number
    ) => {

        try {

            const updated =
                await updateComment(id, editText);

            setPost((prev) =>
                prev
                    ? {
                        ...prev,

                        comments:
                            prev.comments?.map(
                                (c) =>
                                    c.id === id
                                        ? updated
                                        : c
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
        <>

            <Link
                href="/"
                className="
                    absolute left-6 top-6 z-50
                    flex items-center gap-2
                    rounded-full
                    border border-white/10
                    bg-white/5
                    px-4 py-2
                    text-sm text-zinc-300
                    backdrop-blur-xl
                    transition
                    hover:bg-white/10
                    hover:text-white
                "
            >
                <ArrowLeft size={16} />
                Volver
            </Link>

            <div className="max-w-6xl mx-auto px-6 py-10 text-white">

                {/* POST */}
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5">

                    <h1 className="text-3xl font-bold">
                        {post.title}
                    </h1>

                    {/* USER INFO */}
                    <div className="flex items-center gap-3 mt-4">
                        {/* AVATAR */}
                        <Link href={`/users/${post.user?.id}`}>
                            <div
                                className="
                                    h-12
                                    w-12
                                    rounded-full
                                    overflow-hidden
                                    border border-white/10
                                "
                            >
                                {post.user?.avatar ? (
                                    <img
                                        src={post.user.avatar}
                                        alt={post.user.name}
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    <div
                                        className="
                                            h-full
                                            w-full
                                            bg-gradient-to-br
                                            from-purple-500
                                            to-blue-500
                                            flex
                                            items-center
                                            justify-center
                                            text-sm
                                            font-bold
                                            text-white
                                        "
                                    >
                                        {post.user?.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* NAME */}
                        <Link
                            href={`/users/${post.user?.id}`}
                            className="
                                text-zinc-400
                                hover:text-white
                                transition
                            "
                        >
                            by {post.user?.name}
                        </Link>
                    </div>

            
                    <div
                        className="
                            prose
                            prose-invert
                            max-w-none
                        "
                        dangerouslySetInnerHTML={{
                            __html: post.content,
                        }}
                    />
                    {/* TAGS */}
                    {post.tags &&
                        post.tags.length > 0 && (

                            <div className="flex flex-wrap gap-2 mt-5">

                                {post.tags.map((tag) => (

                                    <button
                                        key={tag.id}
                                        className="
                                            px-3 py-1
                                            rounded-full
                                            bg-white/10
                                            text-xs
                                            text-zinc-300
                                        "
                                    >
                                        #{tag.name}
                                    </button>

                                ))}

                            </div>
                        )}

                    {/* LIKE */}
                    <button
                        onClick={handleToggleLike}
                        disabled={loadingLike}
                        className={`
                            mt-5
                            px-4 py-2
                            rounded-xl
                            transition

                            ${isLiked
                                ? "bg-red-500"
                                : "bg-white/10"}
                        `}
                    >
                        ❤️ {likesCount}
                    </button>

                    {/* OWNER ACTIONS */}
                    {user?.id === post.user.id && (

                        <div className="flex gap-3 mt-4">

                            <Link
                                href={`/posts/${post.id}/edit`}
                                className="
                                    text-blue-400
                                    hover:text-blue-300
                                    transition
                                "
                            >
                                <Pencil size={18} />
                            </Link>

                            <button
                                onClick={handleDeletePost}
                                className="
                                    text-red-400
                                    hover:text-red-300
                                    transition
                                "
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="ml-auto text-xs text-zinc-500">

                                {new Date(post.created_at).toLocaleDateString()}

                            </div>

                        </div>
                    )}

                </div>

                {/* COMMENTS */}
                <div className="mt-12">

                    <h2 className="text-xl font-semibold mb-4">
                        Comentarios
                    </h2>

                    {/* INPUT */}
                    <div className="flex gap-2 mb-6">

                        <input
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            placeholder="Escribí un comentario..."
                            className="
                                flex-1
                                bg-white/5
                                border border-white/10
                                px-4 py-2
                                rounded-xl
                            "
                        />

                        <button
                            onClick={handleComment}
                            disabled={loadingComment}
                            className="
                                px-4 py-2
                                bg-white
                                text-black
                                rounded-xl
                            "
                        >
                            Enviar
                        </button>

                    </div>

                    {/* COMMENTS LIST */}
                    <div className="space-y-4">

                        {post.comments?.length ? (

                            post.comments.map((c) => (

                                <div
                                    key={c.id}
                                    className="
                                        p-4
                                        rounded-2xl
                                        bg-white/5
                                        border border-white/10
                                    "
                                >

                                    <p className="text-sm text-zinc-400">
                                        {c.user?.name ?? "Usuario"}
                                    </p>
                                    <span className="text-zinc-600 text-xs">
                                        •
                                        {new Date(c.created_at).toLocaleString()}
                                    </span>

                                    {editingId === c.id ? (

                                        <div className="flex gap-2 mt-2">

                                            <input
                                                value={editText}
                                                onChange={(e) =>
                                                    setEditText(
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    flex-1
                                                    bg-white/10
                                                    px-2 py-1
                                                    rounded
                                                "
                                            />

                                            <button
                                                onClick={() =>
                                                    handleUpdate(c.id)
                                                }
                                                className="
                                                    text-green-400
                                                "
                                            >
                                                <Check size={18} />
                                            </button>

                                        </div>

                                    ) : (

                                        <p className="text-white mt-1">
                                            {c.content}
                                        </p>
                                    )}

                                    {/* ACTIONS */}
                                    <div className="flex gap-4 mt-3">

                                        <button
                                            onClick={() =>
                                                setReplyingTo(
                                                    replyingTo === c.id
                                                        ? null
                                                        : c.id
                                                )
                                            }
                                            className="
                                                text-sm
                                                text-zinc-400
                                                hover:text-white
                                            "
                                        >
                                            Responder
                                        </button>

                                        {user?.id === c.user?.id &&
                                            editingId !== c.id && (

                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(c)
                                                        }
                                                        className="
                                                            text-blue-400
                                                        "
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(c.id)
                                                        }
                                                        className="
                                                            text-red-400
                                                        "
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}

                                    </div>

                                    {/* REPLY INPUT */}
                                    {replyingTo === c.id && (

                                        <div className="mt-4 flex gap-2">

                                            <input
                                                value={replyText}
                                                onChange={(e) =>
                                                    setReplyText(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Responder..."
                                                className="
                                                    flex-1
                                                    bg-white/10
                                                    border border-white/10
                                                    rounded-xl
                                                    px-3 py-2
                                                "
                                            />

                                            <button
                                                onClick={() =>
                                                    handleReply(c.id)
                                                }
                                                className="
                                                    px-4 py-2
                                                    rounded-xl
                                                    bg-white
                                                    text-black
                                                "
                                            >
                                                Enviar
                                            </button>

                                        </div>
                                    )}

                                    {/* REPLIES */}
                                    {c.replies &&
                                        c.replies.length > 0 && (

                                            <div className="mt-4 ml-6 space-y-3">

                                                {c.replies.map((reply) => (

                                                    <div
                                                        key={reply.id}
                                                        className="
        border-l
        border-white/10
        pl-4
    "
                                                    >

                                                        <div className="flex items-center justify-between">

                                                            <p className="text-xs text-zinc-500">
                                                                {reply.user?.name}
                                                            </p>

                                                            {user?.id === reply.user?.id && (

                                                                <div className="flex gap-3 mt-2">

                                                                    <button
                                                                        onClick={() =>
                                                                            handleDelete(reply.id)
                                                                        }
                                                                        className="
                text-red-400
                hover:text-red-300
                transition
            "
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>

                                                                </div>
                                                            )}

                                                            <span className="text-zinc-600 text-xs">
                                                                {new Date(
                                                                    reply.created_at
                                                                ).toLocaleString()}
                                                            </span>

                                                        </div>

                                                        <p className="text-sm text-zinc-200 mt-1">
                                                            {reply.content}
                                                        </p>

                                                    </div>
                                                ))}

                                            </div>
                                        )}

                                </div>
                            ))

                        ) : (

                            <p className="text-sm text-zinc-500">
                                Sin comentarios aún
                            </p>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}