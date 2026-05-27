"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
    onSearch: (value: string) => void;
};

export default function FeedToolbar({
    onSearch,
}: Props) {
    const [value, setValue] = useState("");

    const handleSearch = () => {
        onSearch(value);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center gap-4 mb-8">

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
                            setValue(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar posts..."
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
                        px-5
                        py-3
                        rounded-2xl
                        bg-white/10
                        border border-white/10
                        text-white
                        hover:bg-white/20
                        transition
                        whitespace-nowrap
                    "
                >
                    Buscar
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
    );
}