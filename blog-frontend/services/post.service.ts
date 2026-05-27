import { api } from "./api";

export const getPosts = async (token: string) => {
  const res = await api.get("/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const createPost = async ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const res = await api.post("/posts", {
    title,
    content,
  });

  return res.data.data;
};