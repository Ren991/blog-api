"use client";

import {

    Bold,

    Italic,

    Underline as UnderlineIcon,

    List,

    ListOrdered,

    Heading1,

    Heading2,

    TableIcon,

} from "lucide-react";

type Props = {
    editor: any;
};

export default function Toolbar({
    editor,
}: Props) {

    if (!editor) return null;

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

    return (
        <div
            className="
                flex flex-wrap gap-2
                border border-white/10
                border-b-0
                rounded-t-2xl
                bg-white/5
                p-3
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
                className={`
                    ${buttonClass}
                    ${editor.isActive("heading", { level: 1 })
                        ? activeClass
                        : ""}
                `}
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
                className={`
                    ${buttonClass}
                    ${editor.isActive("heading", { level: 2 })
                        ? activeClass
                        : ""}
                `}
            >
                <Heading2 size={18} />
            </button>

            {/* BOLD */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                className={`
                    ${buttonClass}
                    ${editor.isActive("bold")
                        ? activeClass
                        : ""}
                `}
            >
                <Bold size={18} />
            </button>

            {/* ITALIC */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
                className={`
                    ${buttonClass}
                    ${editor.isActive("italic")
                        ? activeClass
                        : ""}
                `}
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
                className={`
                    ${buttonClass}
                    ${editor.isActive("underline")
                        ? activeClass
                        : ""}
                `}
            >
                <UnderlineIcon size={18} />
            </button>

            {/* BULLET LIST */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleBulletList()
                        .run()
                }
                className={`
                    ${buttonClass}
                    ${editor.isActive("bulletList")
                        ? activeClass
                        : ""}
                `}
            >
                <List size={18} />
            </button>

            {/* ORDERED LIST */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleOrderedList()
                        .run()
                }
                className={`
                    ${buttonClass}
                    ${editor.isActive("orderedList")
                        ? activeClass
                        : ""}
                `}
            >
                <ListOrdered size={18} />
            </button>

            {/* TABLE */}
            <button
                type="button"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .insertTable({
                            rows: 3,
                            cols: 3,
                            withHeaderRow: true,
                        })
                        .run()
                }
                className={buttonClass}
            >
                <TableIcon size={18} />
            </button>

        </div>
    );
}