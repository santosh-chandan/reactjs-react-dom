// Import the `create` function from zustand to build a global store hook
import { create } from "zustand";

// Import API helper that handles authentication endpoints (login, register, logout, refresh)
import authApi from "../services/api/authApi";

// Create the Zustand hook/store. `set` updates state, `get` reads current state.
export const useAuthStore = create((set, get) => ({
  // ===== State =====
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  loading: false,
  error: null,

  // ===== Simple setters =====
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  // ===== LOGIN =====
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("access_token", res.token);
      set({ user: res.user, token: res.token });
    } catch (err) {
      console.error("Login failed:", err);
      const errorMsg =
        err?.response?.data?.message || err.message || "Login failed";
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  // ===== REGISTER =====
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register({ name, email, password });
      localStorage.setItem("access_token", res.token);
      set({ user: res.user, token: res.token });
    } catch (err) {
      console.error("Register failed:", err);
      const errorMsg =
        err?.response?.data?.message || err.message || "Registration failed";
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  // ===== LOGOUT =====
  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    }
    localStorage.removeItem("access_token");
    set({ user: null, token: null, error: null });
  },

  // ===== CHECK AUTH =====
  checkAuth: async () => {
    let token = get().token || localStorage.getItem("access_token");

    try {
      if (!token) {
        const refreshRes = await authApi.refresh();
        token = refreshRes.accessToken;
        if (!token) throw new Error("No access token returned");
        localStorage.setItem("access_token", token);
        set({ token });
      }

      const meRes = await authApi.getMe(token);
      set({ user: meRes.user });
    } catch (err) {
      console.warn("Auth check failed, attempting refresh...", err);
      try {
        const refreshRes = await authApi.refresh();
        token = refreshRes.accessToken;
        if (!token) throw new Error("No access token returned");
        localStorage.setItem("access_token", token);
        set({ token });
        const meRes = await authApi.getMe(token);
        set({ user: meRes.user });
      } catch (refreshErr) {
        console.warn("Refresh token expired, logging out:", refreshErr);
        await get().logout();
      }
    }
  },
}));
