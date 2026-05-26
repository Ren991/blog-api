import axios from "axios";

export const api = axios.create({
  //baseURL: "http://127.0.0.1:8000/api",
  baseURL:"https://special-telegram-4964xv6xr6v2j9wp-8000.app.github.dev/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});