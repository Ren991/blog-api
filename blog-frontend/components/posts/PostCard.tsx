"use client";

import Link from "next/link";

import { useState } from "react";

import { Heart, View } from "lucide-react";

import { likePost, unlikePost, } from "@/services/like.service";

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
        name: string;
        id: number;
    };

    likes_count?: number;

    is_liked: boolean;

    comments_count?: number;

    tags?: Tag[];
};

type Props = {
    post: Post;

    onTagClick?: (
        tag: string
    ) => void;
};

export default function PostCard({
    post,
    onTagClick,
}: Props) {
    const [liked, setLiked] =
        useState(post.is_liked);

    const [likesCount, setLikesCount] =
        useState(
            post.likes_count || 0
        );

    const [loading, setLoading] =
        useState(false);

    // =========================
    // LIKE
    // =========================
    const handleLike = async () => {

        if (loading) return;

        setLoading(true);

        try {

            if (liked) {

                setLiked(false);

                setLikesCount(
                    (prev) => prev - 1
                );

                await unlikePost(post.id);

            } else {

                setLiked(true);

                setLikesCount(
                    (prev) => prev + 1
                );

                await likePost(post.id);
            }

        } catch (err) {

            console.error(err);

            // rollback
            setLiked(!liked);

            setLikesCount((prev) =>
                liked
                    ? prev + 1
                    : prev - 1
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // UI
    // =========================
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

                {/* Creado por : {post.user.name} */}
                <Link
    href={`/users/${post.user.id}`}
    className="
        hover:text-white
        transition
    "
>
    {post.user.name}
</Link>

            </div>

            {/* TITLE */}
            <Link href={`/posts/${post.id}`}>

                <h2
                    className="
                        mt-2
                        text-lg
                        font-semibold
                        hover:underline
                        text-white
                    "
                >
                    {post.title}
                </h2>

            </Link>

            {/* CONTENT */}

            <div className="text-zinc-300 mt-2 line-clamp-3 cursor-pointer"

                dangerouslySetInnerHTML={{
                    __html: post.content
                }}
            />

            {/* TAGS */}
            {post.tags &&
                post.tags.length > 0 && (

                    <div className="flex flex-wrap gap-2 mt-4">

                        {post.tags.map((tag) => (

                            <button
                                key={tag.id}
                                onClick={() =>
                                    onTagClick?.(
                                        `#${tag.name}`
                                    )
                                }
                                className="
                                    px-3 py-1
                                    rounded-full
                                    bg-blue-500/10
                                    border border-blue-500/20
                                    text-blue-300
                                    text-xs
                                    hover:bg-blue-500/20
                                    transition
                                "
                            >
                                #{tag.name}
                            </button>

                        ))}

                    </div>
                )}

            {/* ACTIONS */}
            <div className="flex items-center gap-4 mt-4">

                {/* LIKE */}
                <button
                    onClick={handleLike}
                    disabled={loading}
                    className="
                        flex items-center gap-2
                        text-sm text-zinc-300
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

                    {likesCount}

                </button>

                {/* COMMENTS */}
                <div className="text-sm text-zinc-400">

                    💬 {post.comments_count || 0}

                </div>




                {/* DATE */}
                <div className="ml-auto text-xs text-zinc-500">

                    {new Date(post.created_at).toLocaleDateString()}

                </div>
                <Link href={`/posts/${post.id}`}>
                    
                    <View
                        size={15}
                    />

                </Link>

            </div>

        </div>
    );
}