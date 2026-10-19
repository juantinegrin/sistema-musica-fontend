import axios from "axios";

export const api = axios.create({
  // Pega a URL do .env em produção ou usa o FastAPI local por padrão
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});