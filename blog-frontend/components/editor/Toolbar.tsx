"use client";

import { useState, useRef, useEffect } from "react";

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    TableIcon,
    Plus,
    Minus,
    Smile,
    ImageIcon
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { uploadImage } from "@/services/upload.service";



type Props = {
    editor: any;
};

export default function Toolbar({ editor }: Props) {
    if (!editor) return null;
    const MAX_COLS = 15;

    const [showTableMenu, setShowTableMenu] =
        useState(false);

    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [showEmoji, setShowEmoji] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);


    const buttonClass = `
        p-2
        rounded-xl
        transition
        hover:bg-white/10
    `;

    const activeClass = `
        bg-white/10
        text-white
    `;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setShowTableMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowEmoji(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className="
                flex flex-wrap gap-2
                border border-white/10
                border-b-0
                rounded-t-2xl
                bg-white/5
                p-3
                relative
            "
        >
            {/* H1 */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 1 })
                        .run()
                }
                className={`${buttonClass} ${editor.isActive("heading", { level: 1 })
                    ? activeClass
                    : ""
                    }`}
            >
                <Heading1 size={18} />
            </button>

            {/* H2 */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 2 })
                        .run()
                }
                className={`${buttonClass} ${editor.isActive("heading", { level: 2 })
                    ? activeClass
                    : ""
                    }`}
            >
                <Heading2 size={18} />
            </button>

            {/* BOLD */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleBold().run()
                }
                className={`${buttonClass} ${editor.isActive("bold") ? activeClass : ""
                    }`}
            >
                <Bold size={18} />
            </button>

            {/* ITALIC */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleItalic().run()
                }
                className={`${buttonClass} ${editor.isActive("italic")
                    ? activeClass
                    : ""
                    }`}
            >
                <Italic size={18} />
            </button>

            {/* UNDERLINE */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run()
                }
                className={`${buttonClass} ${editor.isActive("underline")
                    ? activeClass
                    : ""
                    }`}
            >
                <UnderlineIcon size={18} />
            </button>

            {/* UL */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
                className={`${buttonClass} ${editor.isActive("bulletList")
                    ? activeClass
                    : ""
                    }`}
            >
                <List size={18} />
            </button>

            {/* OL */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
                className={`${buttonClass} ${editor.isActive("orderedList")
                    ? activeClass
                    : ""
                    }`}
            >
                <ListOrdered size={18} />
            </button>

            {/* ========================= */}
            {/* TABLE (DYNAMIC MENU) */}
            {/* ========================= */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() =>
                        setShowTableMenu((v) => !v)
                    }
                    className={buttonClass}
                >
                    <TableIcon size={18} />
                </button>
                <div ref={menuRef}>
                    {showTableMenu && (
                        <div
                            className="
                            absolute
                            top-12
                            left-0
                            z-50
                            w-60
                            rounded-2xl
                            border border-white/10
                            bg-zinc-900
                            p-4
                            shadow-xl
                        "
                        >
                            <p className="text-sm text-zinc-400 mb-3">
                                Insertar tabla
                            </p>

                            {/* ROWS */}
                            <label className="text-xs text-zinc-500">
                                Filas
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={rows}
                                onChange={(e) =>
                                    setRows(
                                        Number(e.target.value)
                                    )
                                }
                                className="
                                w-full
                                mt-1 mb-3
                                px-3 py-2
                                rounded-lg
                                bg-white/5
                                border border-white/10
                            "
                            />

                            {/* COLS */}
                            <label className="text-xs text-zinc-500">
                                Columnas
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={cols}
                                onChange={(e) =>
                                    setCols(
                                        Number(e.target.value)
                                    )
                                }
                                className="
                                w-full
                                mt-1 mb-4
                                px-3 py-2
                                rounded-lg
                                bg-white/5
                                border border-white/10
                            "
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    const safeCols = Math.min(cols, MAX_COLS);

                                    editor
                                        .chain()
                                        .focus()
                                        .insertTable({
                                            rows,
                                            cols: safeCols,
                                            withHeaderRow: true,
                                        })
                                        .run();

                                    setShowTableMenu(false);
                                }}
                                className="
                                w-full
                                bg-white
                                text-black
                                py-2
                                rounded-xl
                                font-medium
                            "
                            >
                                Crear tabla
                            </button>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .addRowAfter()
                                            .run()
                                    }
                                    className="flex-1 text-xs bg-white/10 p-2 rounded"
                                >
                                    +Fila
                                </button>

                                <button
                                    onClick={() => {
                                        const table = editor.getAttributes("table");

                                        const currentCols =
                                            editor.state.doc
                                                .resolve(editor.state.selection.from)
                                                .node(-1)
                                                ?.childCount || 0;

                                        if (currentCols >= MAX_COLS) return;

                                        editor
                                            .chain()
                                            .focus()
                                            .addColumnAfter()
                                            .run();
                                    }}
                                    className="flex-1 text-xs bg-white/10 p-2 rounded"

                                >
                                    +Col
                                </button>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .deleteRow()
                                            .run()
                                    }
                                    className="flex-1 text-xs bg-red-500/20 p-2 rounded"
                                >
                                    -Fila
                                </button>

                                <button
                                    onClick={() =>
                                        editor
                                            .chain()
                                            .focus()
                                            .deleteColumn()
                                            .run()
                                    }
                                    className="flex-1 text-xs bg-red-500/20 p-2 rounded"
                                >
                                    -Col
                                </button>
                            </div>
                        </div>
                    )} </div>

            </div>
            <button
                type="button"
                onClick={() => setShowEmoji((v) => !v)}
                className={buttonClass}
            >
                <Smile size={18} />
            </button>
            {showEmoji && (
                <div ref={pickerRef} className="absolute z-50 mt-2">
                    <EmojiPicker
                        onEmojiClick={(emojiData) => {
                            editor.chain().focus().insertContent(emojiData.emoji).run();
                        }}
                    />
                </div>
            )}
            <button
                type="button"
                className={buttonClass}
                onClick={async () => {

                    const input =
                        document.createElement("input");

                    input.type = "file";

                    input.accept = "image/*";

                    input.click();

                    input.onchange = async () => {

                        if (!input.files?.length)
                            return;

                        const file =
                            input.files[0];

                        const url =
                            await uploadImage(file);

                        editor
                            .chain()
                            .focus()
                            .setImage({ src: url })
                            .run();
                    };
                }}
            >
                <ImageIcon size={18} />
            </button>
        </div>
    );
}