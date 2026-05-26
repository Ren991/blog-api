import { api } from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function login(data: LoginData) {

  const response = await api.post("/login", data);

  return response.data;
}

export async function register(data: RegisterData) {

  const response = await api.post("/register", data);

  return response.data;
}