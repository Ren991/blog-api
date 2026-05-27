"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { createPost } from "@/services/post.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreatePostPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);

    const handleCreatePost = async () => {
        if (!title.trim() || !content.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Completa todos los campos",
            });

            return;
        }

        try {
            setLoading(true);

            await createPost({
                title,
                content,
            });

            await Swal.fire({
                icon: "success",
                title: "Post creado correctamente",
                timer: 1500,
                showConfirmButton: false,
            });

            router.push("/");
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Error al crear el post",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 text-white">
            <Link
                href="/"
                className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
            >
                <ArrowLeft size={16} />
                Volver
            </Link>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Crear publicación
                </h1>

                {/* TITLE */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm text-zinc-400">
                        Título
                    </label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título del post..."
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none"
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
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none resize-none"
                    />

                    <div className="text-right text-xs text-zinc-500 mt-2">
                        {content.length} caracteres
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleCreatePost}
                    disabled={loading}
                    className="w-full rounded-xl bg-white text-black font-semibold py-3 transition hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Publicando..." : "Publicar"}
                </button>
            </div>
        </div>
    );
}