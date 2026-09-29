import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1000";

export const server = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Clerk mints a short-lived token per request instead of handing out one
// long-lived credential to keep. Reading it off window.Clerk rather than
// through the hook keeps this a plain module that any caller can import,
// including the ones outside React — and there is no ordering hazard, since a
// request made before Clerk has loaded has no session to send anyway.
server.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = await window.Clerk?.session?.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
