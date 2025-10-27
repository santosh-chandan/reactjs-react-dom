import axiosClient from "./axiosClient";
import type { AuthResponse } from "../types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
}

const authApi = {
  // 🔹 POST /auth/login
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/login", payload);
    return response; // axiosClient already returns .data
  },

  login1: (payload: LoginPayload): Promise<AuthResponse> =>
    axiosClient.post<AuthResponse>("/auth/login", payload),

  // 🔹 POST /auth/register
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/register", payload);
    return response;
  },

  // 🔹 POST /auth/refresh (token refresh)
  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await axiosClient.post("/auth/refresh", { refresh_token: refreshToken });
    return response;
  },

  refreshToken1: (refreshToken: string): Promise<{ access_token: string }> =>
    axiosClient.post<{ access_token: string }>("/auth/refresh", {
      refresh_token: refreshToken,
    }),

  // 🔹 POST /auth/logout
  logout: async (): Promise<void> => {
    await axiosClient.post("/auth/logout");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

export default authApi;
