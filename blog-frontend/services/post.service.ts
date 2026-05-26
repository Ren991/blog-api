import { api } from "./api";

export const getPosts = async (token: string) => {
  const res = await api.get("/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};