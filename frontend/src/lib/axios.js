import axios from "axios";

const DEFAULT_LOCAL = "http://localhost:5001/api";
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? DEFAULT_LOCAL : "/api");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
