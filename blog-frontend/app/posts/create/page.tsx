"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

import { ArrowLeft, X } from "lucide-react";
import SlideToPost from "@/components/ui/SlideToPost";
import { createPost } from "@/services/post.service";
import Link from "next/link";
import PostEditor from "@/components/editor/PostEditor";

export default function CreatePostPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // input temporal
    const [tagInput, setTagInput] = useState("");

    // tags reales
    const [tags, setTags] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

    // =========================
    // ADD TAG
    // =========================
    const handleTagKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        // cuando toca coma
        if (e.key === "," || e.key === "Enter") {

            e.preventDefault();

            const value = tagInput.trim().toLowerCase();

            // evitar vacíos y repetidos
            if (!value || tags.includes(value)) {
                setTagInput("");
                return;
            }

            setTags((prev) => [...prev, value]);

            setTagInput("");
        }
    };

    // =========================
    // REMOVE TAG
    // =========================
    const handleRemoveTag = (tagToRemove: string) => {

        setTags((prev) =>
            prev.filter((tag) => tag !== tagToRemove)
        );
    };

    // =========================
    // CREATE POST
    // =========================
    const handleCreatePost = async (): Promise<boolean> => {
        if (!title.trim() || !content.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Completa todos los campos",
            });

            return false;
        }

        const cleanContent = content
        .replace(/<[^>]*>/g, '') // Elimina todos los tags HTML
        .trim();

        if (!cleanContent) {
            Swal.fire({
                icon: "warning",
                title: "El contenido no puede ser solo imágenes, agrega texto",
            });
            return false;
        }


        try {

            setLoading(true);

            await createPost({
                title,
                content,
                tags,
            });

            await Swal.fire({
                icon: "success",
                title: "Post creado correctamente",
                timer: 1500,
                showConfirmButton: false,
            });

            router.push("/");
            return true


        } catch (err: any) {

            const message =
                err.response.data.message ||
                "Error al crear el post";

            Swal.fire({
                icon: "error",
                title: message,
            });
            return false

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 text-white">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                {/* BACK */}
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
                {/* TITLE */}
                <h1 className="text-3xl font-bold mb-6">
                    Crear publicación
                </h1>

                {/* INPUT TITLE */}
                <div className="mb-4">

                    <label className="block mb-2 text-sm text-zinc-400">
                        Título
                    </label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título del post..."
                        className="
                            w-full
                            rounded-xl
                            bg-white/5
                            border border-white/10
                            px-4 py-3
                            outline-none
                        "
                    />
                </div>

                {/* CONTENT */}
                <div className="mb-6">

                    <label className="block mb-2 text-sm text-zinc-400">
                        Contenido
                    </label>


                    <PostEditor
                        content={content}
                        onChange={setContent}
                    />

                    <div className="text-right text-xs text-zinc-500 mt-2">
                        {content.length} caracteres
                    </div>
                </div>

                {/* TAGS */}
                <div className="mb-6">

                    <label className="block mb-2 text-sm text-zinc-400">
                        Tags
                    </label>

                    {/* TAG INPUT */}
                    <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Escribí un tag y presioná coma..."
                        className="
                            w-full
                            rounded-xl
                            bg-white/5
                            border border-white/10
                            px-4 py-3
                            outline-none
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
                                        handleRemoveTag(tag)
                                    }
                                    className="
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

                <SlideToPost
                    onComplete={handleCreatePost}
                    loading={loading}
                />

            </div>
        </div>
    );
}