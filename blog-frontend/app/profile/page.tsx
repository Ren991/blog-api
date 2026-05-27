"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

import {
    LogOut,
    Heart,
    ArrowLeft,
} from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getLikedPosts } from "@/services/post.service";

import PostCard from "@/components/posts/PostCard";

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
    };

    likes_count?: number;

    comments_count?: number;

    is_liked: boolean;

    tags?: Tag[];
};

export default function ProfilePage() {

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const router = useRouter();

    const [likedPosts, setLikedPosts] =
        useState<Post[]>([]);

    const [loadingLikes, setLoadingLikes] =
        useState(true);

    // =========================
    // REDIRECT
    // =========================
    useEffect(() => {

        if (!isAuthenticated) {

            router.push("/login");
        }

    }, [isAuthenticated, router]);

    // =========================
    // FETCH LIKED POSTS
    // ========================= 
    useEffect(() => {

        const fetchLikedPosts = async () => {

            try {

                setLoadingLikes(true);

                const data =
                    await getLikedPosts();

                setLikedPosts(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoadingLikes(false);
            }
        };

        if (isAuthenticated) {

            fetchLikedPosts();
        }

    }, [isAuthenticated]);

    if (!user) return null;

    // =========================
    // UI
    // =========================
    return (
        <main className="min-h-screen bg-black text-white px-6 py-10">

            {/* BACK */}
            <Link
                href="/"
                className="
                    inline-flex
                    items-center
                    gap-2
                    mb-8
                    text-zinc-400
                    hover:text-white
                    transition
                "
            >
                <ArrowLeft size={18} />
                Volver
            </Link>

            <div className="max-w-4xl mx-auto">

                {/* PROFILE CARD */}
                <div
                    className="
                        rounded-3xl
                        border border-white/10
                        bg-white/5
                        p-8
                        backdrop-blur-xl
                    "
                >

                    {/* HEADER */}
                    <div className="flex items-center gap-5">

                        {/* AVATAR */}
                        <div
                            className="
                                h-24
                                w-24
                                rounded-full
                                bg-gradient-to-br
                                from-purple-500
                                to-blue-500
                                flex
                                items-center
                                justify-center
                                text-3xl
                                font-bold
                            "
                        >
                            {user.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        {/* INFO */}
                        <div>

                            <h1 className="text-3xl font-bold">
                                {user.name}
                            </h1>

                            <p className="text-zinc-400 mt-1">
                                {user.email}
                            </p>

                            <div className="flex gap-6 mt-4 text-sm">

                                <div>
                                    <span className="text-zinc-500">
                                        Likes dados
                                    </span>

                                    <p className="font-semibold text-white">
                                        {likedPosts.length}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-zinc-500">
                                        Estado
                                    </span>

                                    <p className="text-green-400 font-semibold">
                                        Activo
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="mt-8 flex flex-wrap gap-3">

                        <button
                            onClick={logout}
                            className="
                                flex items-center
                                gap-2
                                rounded-xl
                                bg-red-500/10
                                text-red-400
                                px-5 py-3
                                hover:bg-red-500/20
                                transition
                            "
                        >

                            <LogOut size={18} />

                            Cerrar sesión

                        </button>

                        <button
                            onClick={() =>
                                router.push("/")
                            }
                            className="
                                rounded-xl
                                border border-white/10
                                px-5 py-3
                                hover:bg-white/5
                                transition
                            "
                        >
                            Inicio
                        </button>

                    </div>

                </div>

                {/* LIKED POSTS */}
                <div className="mt-12">

                    <div className="flex items-center gap-3 mb-6">

                        <Heart
                            className="text-red-500"
                            size={22}
                        />

                        <h2 className="text-2xl font-bold">
                            Posts que te gustaron
                        </h2>

                    </div>

                    {/* LOADING */}
                    {loadingLikes ? (

                        <div className="space-y-4">

                            {Array.from({
                                length: 3,
                            }).map((_, i) => (

                                <div
                                    key={i}
                                    className="
                                        h-32
                                        rounded-2xl
                                        bg-white/5
                                        border border-white/10
                                        animate-pulse
                                    "
                                />

                            ))}

                        </div>

                    ) : likedPosts.length > 0 ? (

                        <div className="space-y-4">

                            {likedPosts.map((post) => (

                                <PostCard
                                    key={post.id}
                                    post={post}
                                />

                            ))}

                        </div>

                    ) : (

                        <div
                            className="
                                rounded-2xl
                                border border-white/10
                                bg-white/5
                                p-8
                                text-center
                                text-zinc-500
                            "
                        >
                            No tenés posts likeados aún
                        </div>

                    )}

                </div>

            </div>

        </main>
    );
}