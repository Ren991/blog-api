import { api } from "./api";

/* export const getPosts = async (token: string) => {
  const res = await api.get("/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
}; */
export const getPosts = async (
    token: string,
    search?: string
) => {

    const res = await api.get("/posts", {
        params: {
            search,
        },
    });

    return res.data.data;
};

export const createPost = async ({
  title,
  content,
  tags,
}: {
  title: string;
  content: string;
  tags: string[];
}) => {
  const res = await api.post("/posts", {
    title,
    content,
    tags,
  });

  return res.data.data;
};

export const updatePost = async (
  id: number,
  data: {
    title: string;
    content: string;
    tags: string[];
  }
) => {

  const res = await api.put(`/posts/${id}`, data);

  return res.data.data;
};

export const deletePost = async (
  id: number
) => {

  const res = await api.delete(`/posts/${id}`);

  return res.data;
};

export const getLikedPosts = async () => {

    const res = await api.get("/liked-posts");

    return res.data.data;
};