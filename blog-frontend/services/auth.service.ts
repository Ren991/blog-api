import { api } from "./api";

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {

  const response = await api.post("/login", data);

  return response.data;
}