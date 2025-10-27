import { create } from "zustand";
import authApi from "../services/api/authApi";
import userApi from "../services/api/userApi";
import type { AuthResponse } from "../services/types/auth";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // actions
  setUser: (user: AuthResponse["user"] | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  loading: false,
  error: null,

  // simple setters
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  // login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login({ email, password });

      // Save access token in memory/localStorage
      localStorage.setItem("access_token", res.token);
      set({ user: res.user, token: res.token });
    } catch (err: any) {
      console.error("Login failed:", err);
      const errorMsg =
        err?.response?.data?.message || err.message || "Login failed";
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  // register
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register({ name, email, password });
      localStorage.setItem("access_token", res.token);
      set({ user: res.user, token: res.token });
    } catch (err: any) {
      console.error("Register failed:", err);
      const errorMsg =
        err?.response?.data?.message || err.message || "Registration failed";
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  // logout
  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    }
    localStorage.removeItem("access_token");
    set({ user: null, token: null, error: null });
  },

  // checkAuth (used by AuthInitializer)
  checkAuth: async () => {
    const token = get().token || localStorage.getItem("access_token");

    // If no token, try to refresh via cookie
    if (!token) {
      try {
        const res = await authApi.refresh();
        localStorage.setItem("access_token", res.accessToken);
        set({ token: res.accessToken });
      } catch {
        console.warn("No refresh token found or invalid");
        set({ user: null, token: null });
        return;
      }
    }

    // Fetch user using access token
    try {
      const user = await userApi.getProfile();
      set({ user });
    } catch (err: any) {
      console.warn("Invalid or expired access token, attempting refresh...", err);

      try {
        const res = await authApi.refresh();
        localStorage.setItem("access_token", res.accessToken);
        set({ token: res.accessToken });

        const user = await userApi.getProfile();
        set({ user });
      } catch (refreshErr) {
        console.warn("Refresh token expired:", refreshErr);
        await get().logout();
      }
    }
  },
}));
