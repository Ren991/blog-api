"use client";

import Link from "next/link";
import { FolderGit2 , Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer
            className="
                relative
                mt-20
                border-t
                border-white/10
                bg-black
            "
        >
            {/* glow */}
            <div
                className="
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-purple-500/50
                    to-transparent
                "
            />

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-10
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-8
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >
                    {/* LEFT */}
                    <div>
                        <h3
                            className="
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            Merge Conflict
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-md
                                text-sm
                                text-zinc-400
                            "
                        >
                            Plataforma para compartir ideas,
                            aprender y conectar con otros
                            desarrolladores.
                        </p>
                    </div>

                    {/* CENTER */}
                    <div
                        className="
                            flex
                            gap-6
                            text-sm
                            text-zinc-400
                        "
                    >
                        <Link
                            href="/"
                            className="
                                transition
                                hover:text-white
                            "
                        >
                            Inicio
                        </Link>

                        <Link
                            href="/feed"
                            className="
                                transition
                                hover:text-white
                            "
                        >
                            Feed
                        </Link>

                        <Link
                            href="/profile"
                            className="
                                transition
                                hover:text-white
                            "
                        >
                            Perfil
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <a
                        href="https://github.com/Ren991"
                        target="_blank"
                        rel="noreferrer"
                        className="
                            flex
                            items-center
                            gap-2
                            text-zinc-400
                            transition
                            hover:text-white
                        "
                    >
                        <FolderGit2 size={18} />
                        GitHub
                    </a>
                </div>

                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-white/10
                        pt-6
                        text-sm
                        text-zinc-500
                        md:flex-row
                    "
                >
                    <p>
                        © {new Date().getFullYear()} Merge
                        Conflict. Todos los derechos reservados.
                    </p>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        Hecho con
                        <Heart size={14} />
                        usando Next.js + Laravel
                    </div>
                </div>
            </div>
        </footer>
    );
}