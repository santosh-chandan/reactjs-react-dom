import { create } from "zustand";
import authApi from "../services/api/authApi";
import userApi from "../services/api/userApi";
import type { AuthResponse } from "../services/types/auth";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  loading: false,

  // 🔹 LOGIN
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("access_token", res.token);
      set({ user: res.user, token: res.token });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 REGISTER
  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.register({ name, email, password });
      localStorage.setItem("access_token", res.token);
      set({ user: res.user, token: res.token });
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 LOGOUT
  logout: () => {
    authApi.logout(); // ✅ call API if backend supports it
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, token: null });
  },

  // 🔹 CHECK AUTH / LOAD USER PROFILE
  checkAuth: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    set({ token, loading: true });
    try {
      const user = await userApi.getProfile(); // ✅ Fetch current user
      set({ user });
    } catch (error) {
      console.warn("Invalid or expired token:", error);
      localStorage.removeItem("access_token");
      set({ user: null, token: null });
    } finally {
      set({ loading: false });
    }
  },
}));
