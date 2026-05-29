"use client";

import {
    EditorContent,
    useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";

import Image from "@tiptap/extension-image";

import {Table} from "@tiptap/extension-table";

import TableRow from "@tiptap/extension-table-row";

import TableHeader from "@tiptap/extension-table-header";

import TableCell from "@tiptap/extension-table-cell";

import Toolbar from "./Toolbar";



type Props = {
    content: string;
    onChange: (value: string) => void;
};

export default function PostEditor({
    content,
    onChange,
}: Props) {

    const editor = useEditor({

        extensions: [

            StarterKit.configure({

                heading: {
                    levels: [1, 2],
                },

            }),

            Underline,
            Image,
            Table.configure({
                resizable: true,
            }),

            TableRow,
            TableHeader,
            TableCell,
        ],

        content,

        editorProps: {

            attributes: {

                class: [
                    "min-h-[250px]",
                    "rounded-b-2xl",
                    "border",
                    "border-white/10",
                    "bg-white/5",
                    "px-4",
                    "py-3",
                    "outline-none",
                    "prose",
                    "prose-invert",
                    "max-w-none",
                    "focus:outline-none",
                ].join(" "),
            },
        },

        onUpdate({ editor }) {

            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="overflow-hidden rounded-2xl">

            <Toolbar editor={editor} />

            <EditorContent editor={editor} />

        </div>
    );
}