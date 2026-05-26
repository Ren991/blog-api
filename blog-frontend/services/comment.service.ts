import { api } from "./api";

export const createComment = async ({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) => {
  const res = await api.post("/comments", {
    post_id: postId,
    content,
  });

  return res.data.data;
};
export const getCommentsByPost = async (postId: number) => {
  const res = await api.get(`/posts/${postId}`);
  return res.data.comments;
};

export const deleteComment = async (commentId: number) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

export const updateComment = async (id: number, content: string) => {
  const res = await api.put(`/comments/${id}`, { content });
  return res.data;
};