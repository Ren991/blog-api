"use client";

import {
    Search,
    Plus,
} from "lucide-react";

import Link from "next/link";

import { useMemo, useState } from "react";

type Props = {
    onSearch: (value: string) => void;
};

export default function FeedToolbar({
    onSearch,
}: Props) {

    const [value, setValue] = useState("");

    // =========================
    // SEARCH
    // =========================
    const handleSearch = () => {

        onSearch(value.trim());
    };

    // =========================
    // ENTER
    // =========================
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (e.key === "Enter") {

            handleSearch();
        }
    };

    // =========================
    // DETECT HASHTAGS
    // =========================
    const hashtags = useMemo(() => {

        return value
            .split(" ")
            .filter((word) =>
                word.startsWith("#")
            )
            .map((tag) =>
                tag.replace("#", "")
            )
            .filter(Boolean);

    }, [value]);

    // =========================
    // REMOVE TAG
    // =========================
    const removeTag = (tagToRemove: string) => {

        const updated = value
            .split(" ")
            .filter(
                (word) =>
                    word !== `#${tagToRemove}`
            )
            .join(" ");

        setValue(updated);

        onSearch(updated);
    };

    return (
        <div className="mb-8">

            {/* TOP BAR */}
            <div className="flex items-center gap-4">

                {/* SEARCH */}
                <div className="flex-1 flex gap-2">

                    {/* INPUT */}
                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-zinc-500
                            "
                        />

                        <input
                            value={value}
                            onChange={(e) =>
                                setValue(
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            placeholder="
Buscar posts, contenido o #tags...
                            "
                            className="
                                w-full
                                bg-white/5
                                border border-white/10
                                rounded-2xl
                                py-3
                                pl-11
                                pr-4
                                text-white
                                outline-none
                                focus:border-white/20
                            "
                        />

                    </div>

                    {/* BUTTON SEARCH */}
                    <button
                        onClick={handleSearch}
                        className="
                            flex items-center justify-center
                            w-12 h-12
                            rounded-2xl
                            bg-white/10
                            border border-white/10
                            text-white
                            hover:bg-white/20
                            transition
                        "
                        title="Buscar"
                    >
                        <Search size={18} />
                    </button>

                </div>

                {/* CREATE POST */}
                <Link
                    href="/posts/create"
                    className="
                        flex items-center gap-2
                        bg-white
                        text-black
                        px-5
                        py-3
                        rounded-2xl
                        font-semibold
                        hover:opacity-90
                        transition
                        whitespace-nowrap
                    "
                >
                    <Plus size={18} />
                    Crear post
                </Link>

            </div>

            {/* HASHTAGS */}
            {hashtags.length > 0 && (

                <div className="flex flex-wrap gap-2 mt-4">

                    {hashtags.map((tag) => (

                        <div
                            key={tag}
                            className="
                                flex items-center gap-2
                                px-3 py-1
                                rounded-full
                                bg-blue-500/20
                                border border-blue-500/20
                                text-blue-300
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
                                    hover:text-red-300
                                    transition
                                "
                            >
                                ×
                            </button>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}