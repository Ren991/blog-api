"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { getUserProfile } from "@/services/user.service";

import PostCard from "@/components/posts/PostCard";

import {
    followUser,
    unfollowUser,
} from "@/services/user.service";

import {
    Users,
    UserPlus,
    UserMinus,
} from "lucide-react";

export default function UserProfilePage() {

    const { id } = useParams();

    const { user } = useAuth();

    

    const [loading, setLoading] =
        useState(true);

    const [profile, setProfile] =
        useState<any>(null);

    const [isFollowing, setIsFollowing] =
        useState(false);

    const [followersCount, setFollowersCount] =
        useState(0);



    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data =
                    await getUserProfile(
                        Number(id)
                    );
                console.log(data)
                setProfile(data);

                setIsFollowing(
                    data.user.is_following
                );

                setFollowersCount(
                    data.user.followers_count
                );

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);
            }
        };

        loadProfile();

    }, [id]);

    const handleFollow = async () => {

        try {

            await followUser(
                Number(id)
            );

            setIsFollowing(true);

            setFollowersCount(
                prev => prev + 1
            );

        } catch (err) {

            console.error(err);
        }
    };

    const handleUnfollow = async () => {

        try {

            await unfollowUser(
                Number(id)
            );

            setIsFollowing(false);

            setFollowersCount(
                prev => Math.max(
                    0,
                    prev - 1
                )
            );

        } catch (err) {

            console.error(err);
        }
    };
const isOwnProfile =
    user?.id === profile?.user?.id;
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
                        overflow-hidden
                        flex
                        items-center
                        justify-center
                        border border-white/10
                    "
                >
                    {profile.user.avatar ? (
                        <img
                            src={profile.user.avatar}
                            alt={profile.user.name}
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
                                text-3xl
                                font-bold
                            "
                        >
                            {profile.user.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}
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
        flex
        gap-10
        mt-6
        flex-wrap
    "
                >

                    <div>
                        <p className="text-2xl font-bold">
                            {profile.stats.posts}
                        </p>

                        <p className="text-zinc-400">
                            Posts
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">
                            {profile.stats.likes_received}
                        </p>

                        <p className="text-zinc-400">
                            Likes
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">
                            {followersCount}
                        </p>

                        <p className="text-zinc-400">
                            Seguidores
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">
                            {profile.user.following_count}
                        </p>

                        <p className="text-zinc-400">
                            Siguiendo
                        </p>
                    </div>

                    <div className="mt-5">

                     {
    !isOwnProfile && (
        <div className="mt-5">

            {isFollowing ? (

                <button
                    onClick={handleUnfollow}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-red-500/10
                        text-red-400
                        px-5
                        py-3
                        hover:bg-red-500/20
                        transition
                    "
                >
                    <UserMinus size={18} />
                    Dejar de seguir
                </button>

            ) : (

                <button
                    onClick={handleFollow}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-green-500/10
                        text-green-400
                        px-5
                        py-3
                        hover:bg-green-500/20
                        transition
                    "
                >
                    <UserPlus size={18} />
                    Seguir
                </button>

            )}

        </div>
    )
}

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