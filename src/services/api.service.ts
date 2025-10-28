import axios, { AxiosRequestHeaders } from "axios";

export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
});

// Inyecta Authorization si hay token en localStorage + logs de depuración
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("auth:token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      undefined;
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers as AxiosRequestHeaders) ?? {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
    try {
      const method = (config.method || 'get').toUpperCase();
      const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
      console.log(`[API->] ${method} ${url} auth=${token ? 'yes' : 'no'}`);
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const m = err?.config?.method ? err.config.method.toUpperCase() : 'REQ';
      const u = err?.config?.baseURL ? `${err.config.baseURL}${err.config.url}` : err?.config?.url;
      console.log(`[API X] ${m} ${u} -> ${err?.response?.status ?? '??'}`);
    } catch {}
    return Promise.reject(err);
  }
);
