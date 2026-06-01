"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { getUserProfile } from "@/services/user.service";

import PostCard from "@/components/posts/PostCard";

export default function UserProfilePage() {

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [profile, setProfile] =
        useState<any>(null);

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data =
                    await getUserProfile(
                        Number(id)
                    );
                console.log(data);
                setProfile(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);
            }
        };

        loadProfile();

    }, [id]);

    if (loading) {

        return (
            <div className="p-8">
                Cargando perfil...
            </div>
        );
    }

    if (!profile) {

        return (
            <div className="p-8">
                Usuario no encontrado
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 text-white">

            <Link
                href="/"
                className="
                    inline-flex
                    items-center
                    gap-2
                    mb-6
                    text-zinc-400
                    hover:text-white
                "
            >
                <ArrowLeft size={18} />
                Volver
            </Link>

            {/* PERFIL */}
            <div
                className="
                    rounded-3xl
                    border border-white/10
                    bg-white/5
                    p-8
                    mb-8
                "
            >

                {/* AVATAR */}
                <div
                    className="
                        h-24 w-24
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
                    {profile.user.name
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <h1
                    className="
                        text-3xl
                        font-bold
                        mt-4
                    "
                >
                    {profile.user.name}
                </h1>

                <p
                    className="
                        text-zinc-400
                    "
                >
                    {profile.user.email}
                </p>

                <div
                    className="
                        flex gap-8 mt-6
                    "
                >

                    <div>
                        <p className="text-2xl font-bold">
                            {
                                profile.stats.posts
                            }
                        </p>

                        <p className="text-zinc-400">
                            Posts
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">
                            {
                                profile.stats.likes_received
                            }
                        </p>

                        <p className="text-zinc-400">
                            Likes
                        </p>
                    </div>

                </div>

            </div>

            {/* POSTS */}
            <div className="space-y-4">

                {profile.posts?.map(
                    (post: any) => (
                        <PostCard
                            key={post.id}
                            post={post}
                        />
                    )
                )}

            </div>

        </div>
    );
}