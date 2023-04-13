import axios from "axios";

export const request = axios.create({
  timeout: 10000,
  withCredentials: true,
  baseURL: "/api",
});
