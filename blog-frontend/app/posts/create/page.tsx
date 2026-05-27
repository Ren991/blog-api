"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

import { X } from "lucide-react";
import SlideToPost from "@/components/ui/SlideToPost";
import { createPost } from "@/services/post.service";

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


        } catch (err) {

            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Error al crear el post",
            });
            return false

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 text-white">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

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

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="¿Qué querés compartir?"
                        rows={8}
                        className="
                            w-full
                            rounded-xl
                            bg-white/5
                            border border-white/10
                            px-4 py-3
                            outline-none
                            resize-none
                        "
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

                {/* BUTTON */}
               {/*  <button
                    onClick={handleCreatePost}
                    disabled={loading}
                    className="
                        w-full
                        rounded-xl
                        bg-white
                        text-black
                        font-semibold
                        py-3
                        transition
                        hover:opacity-90
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? "Publicando..."
                        : "Publicar"}
                </button> */}
                <SlideToPost
    onComplete={handleCreatePost}
    loading={loading}
/>

            </div>
        </div>
    );
}