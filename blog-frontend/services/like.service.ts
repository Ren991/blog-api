import { api } from "./api";

export const likePost = async (postId: number) => {
  const res = await api.post(`/posts/${postId}/like`);
  
  return res.data;
};

export const unlikePost = async (postId: number) => {
  const res = await api.delete(`/posts/${postId}/like`);
  return res.data;
};