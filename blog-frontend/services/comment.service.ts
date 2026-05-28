import { api } from "./api";

// =========================
// CREATE COMMENT / REPLY
// =========================
export const createComment = async ({
    postId,
    content,
    parentId,
}: {
    postId: number;
    content: string;
    parentId?: number;
}) => {

    const res = await api.post("/comments", {
        post_id: postId,
        content,
        parent_id: parentId ?? null,
    });

    return res.data.data;
};

// =========================
// GET COMMENTS BY POST
// =========================
export const getCommentsByPost = async (
    postId: number
) => {

    const res = await api.get(`/posts/${postId}`);

    return res.data.data.comments;
};

// =========================
// DELETE COMMENT
// =========================
export const deleteComment = async (
    commentId: number
) => {

    const res = await api.delete(
        `/comments/${commentId}`
    );

    return res.data;
};

// =========================
// UPDATE COMMENT
// =========================
export const updateComment = async (
    id: number,
    content: string
) => {

    const res = await api.put(
        `/comments/${id}`,
        { content }
    );

    return res.data;
};