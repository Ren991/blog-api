"use client";

import { useEffect, useState } from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import Swal from "sweetalert2";

import {
    ArrowLeft,
    X,
} from "lucide-react";

import Link from "next/link";

import { api } from "@/services/api";

import {
    updatePost,
} from "@/services/post.service";

type Tag = {
    id: number;
    name: string;
};

type Post = {
    id: number;

    title: string;

    content: string;

    tags?: Tag[];
};

export default function EditPostPage() {

    const { id } = useParams();

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [tagInput, setTagInput] = useState("");

    const [tags, setTags] = useState<string[]>([]);

    // =========================
    // FETCH POST
    // =========================
    useEffect(() => {

        const fetchPost = async () => {

            try {

                setLoading(true);

                const res = await api.get(`/posts/${id}`);

                const data: Post = res.data.data;

                setTitle(data.title);

                setContent(data.content);

                setTags(
                    data.tags?.map((t) => t.name) || []
                );

            } catch (err) {

                console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Error cargando post",
                });

            } finally {

                setLoading(false);
            }
        };

        fetchPost();

    }, [id]);

    // =========================
    // TAGS
    // =========================
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (
            e.key === "," ||
            e.key === "Enter"
        ) {

            e.preventDefault();

            const value =
                tagInput.trim().toLowerCase();

            if (
                value &&
                !tags.includes(value)
            ) {

                setTags((prev) => [
                    ...prev,
                    value,
                ]);
            }

            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {

        setTags((prev) =>
            prev.filter((t) => t !== tag)
        );
    };

    // =========================
    // UPDATE POST
    // =========================
    const handleSubmit = async () => {

        // VALIDATIONS
        if (!title.trim()) {

            Swal.fire({
                icon: "warning",
                title: "El título es obligatorio",
            });

            return;
        }

        if (tags.length === 0) {

            Swal.fire({
                icon: "warning",
                title: "Debes agregar al menos un tag",
            });

            return;
        }

        if (!content.trim()) {

            Swal.fire({
                icon: "warning",
                title: "El contenido es obligatorio",
            });

            return;
        }

        try {

            setSaving(true);

            await updatePost(
                Number(id),
                {
                    title,
                    content,
                    tags,
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Post actualizado",
                timer: 1200,
                showConfirmButton: false,
            });

            router.push(`/posts/${id}`);

        } catch (err) {

            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Error actualizando post",
            });

        } finally {

            setSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {

        return (
            <div className="max-w-2xl mx-auto p-8 space-y-4">

                <div className="h-10 bg-white/10 rounded animate-pulse" />

                <div className="h-40 bg-white/10 rounded animate-pulse" />

            </div>
        );
    }

    // =========================
    // UI
    // =========================
    return (
        <div className="max-w-2xl mx-auto px-6 py-10 text-white">

            {/* BACK */}
            <Link
                href={`/posts/${id}`}
                className="
                    inline-flex items-center gap-2
                    text-zinc-400
                    hover:text-white
                    transition
                    mb-6
                "
            >
                <ArrowLeft size={18} />
                Volver
            </Link>

            {/* CARD */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                {/* TITLE */}
                <h1 className="text-3xl font-bold mb-6">
                    Editar post
                </h1>

                {/* TITLE INPUT */}
                <div className="mb-5">

                    <label className="text-sm text-zinc-400 block mb-2">
                        Título
                    </label>

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Título del post"
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-white/5
                            px-4 py-3
                            outline-none
                            focus:border-white/20
                        "
                    />

                </div>

                {/* CONTENT */}
                <div className="mb-5">

                    <label className="text-sm text-zinc-400 block mb-2">
                        Contenido
                    </label>

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(
                                e.target.value
                            )
                        }
                        placeholder="Contenido..."
                        rows={8}
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-white/5
                            px-4 py-3
                            outline-none
                            resize-none
                            focus:border-white/20
                        "
                    />

                </div>

                {/* TAGS */}
                <div className="mb-6">

                    <label className="text-sm text-zinc-400 block mb-2">
                        Tags
                    </label>

                    <input
                        value={tagInput}
                        onChange={(e) =>
                            setTagInput(
                                e.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="react, frontend, laravel..."
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-white/5
                            px-4 py-3
                            outline-none
                            focus:border-white/20
                        "
                    />

                    {/* CHIPS */}
                    <div className="flex flex-wrap gap-2 mt-4">

                        {tags.map((tag) => (

                            <div
                                key={tag}
                                className="
                                    flex items-center gap-2
                                    px-3 py-1
                                    rounded-full
                                    bg-white/10
                                    text-sm
                                "
                            >

                                <span>
                                    #{tag}
                                </span>

                                <button
                                    onClick={() =>
                                        removeTag(tag)
                                    }
                                    className="
                                        text-zinc-400
                                        hover:text-red-400
                                        transition
                                    "
                                >
                                    <X size={14} />
                                </button>

                            </div>
                        ))}

                    </div>

                </div>

                {/* BUTTON */}
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="
                        w-full
                        rounded-xl
                        bg-white
                        text-black
                        py-3
                        font-semibold
                        transition
                        hover:opacity-90
                        disabled:opacity-50
                    "
                >
                    {saving
                        ? "Guardando..."
                        : "Guardar cambios"}
                </button>

            </div>

        </div>
    );
}