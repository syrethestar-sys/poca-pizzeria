import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1000";

export const server = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
