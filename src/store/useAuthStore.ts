// Import the `create` function from zustand to build a global store hook
import { create } from "zustand";

// Import API helper that handles authentication endpoints (login, register, logout, refresh)
import authApi from "../services/api/authApi";

// Import API helper for user-related endpoints if needed (older version used userApi; final uses authApi.getMe)
// import userApi from "../services/api/userApi";

// Import TypeScript type for the auth response so we can type our store correctly
import type { AuthResponse } from "../services/types/auth";

// Define the shape of the auth store with TypeScript for clear, safe usage
interface AuthState {
  // Holds the logged-in user object or null when no user is authenticated
  user: AuthResponse["user"] | null;
  // Holds the access token string or null when there is none
  token: string | null;
  // Flag to indicate ongoing network operations (useful for spinners / disabling buttons)
  loading: boolean;
  // Holds a human-friendly error message or null when there is no error
  error: string | null;

  // ===== Actions (functions that will update or use the store) =====

  // Set the `user` field in the store
  setUser: (user: AuthResponse["user"] | null) => void;
  // Set the `token` field in the store
  setToken: (token: string | null) => void;
  // Attempt login with email and password
  login: (email: string, password: string) => Promise<void>;
  // Attempt registration with name, email and password
  register: (name: string, email: string, password: string) => Promise<void>;
  // Logout the user and clear local client state
  logout: () => Promise<void>;
  // Validate or refresh authentication and load the current user (usually on app init)
  checkAuth: () => Promise<void>;
}

// Create the Zustand hook/store. `set` updates state, `get` reads current state.
export const useAuthStore = create<AuthState>((set, get) => ({

  // initial user is null (no one logged in yet)
  user: null,

  // try to recover an access token from localStorage so session can persist across refreshes
  token: localStorage.getItem("access_token"),

  // not currently loading anything
  loading: false,

  // no error at start
  error: null,

  // ===== Simple setters to update individual fields =====

  // helper to set the user object in the store
  setUser: (user) => set({ user }),

  // helper to set the token in the store
  setToken: (token) => set({ token }),

  // ===== LOGIN =====
  // function that calls your backend to authenticate a user
  login: async (email, password) => {
    // mark loading true and clear previous error before starting network call
    set({ loading: true, error: null });
    try {
      // call the auth API login endpoint with credentials
      const res = await authApi.login({ email, password });

      // persist access token locally so it survives page reloads
      localStorage.setItem("access_token", res.token);

      // update the store with the returned user object and token
      set({ user: res.user, token: res.token });
    } catch (err: any) {
      // log the raw error to the console for debugging
      console.error("Login failed:", err);
      // pick a readable message from the error object (fallback to generic string)
      const errorMsg =
        err?.response?.data?.message || err.message || "Login failed";
      // store the error message so the UI can display it
      set({ error: errorMsg });
    } finally {
      // stop loading regardless of success or error
      set({ loading: false });
    }
  },

  // ===== REGISTER =====
  // function that creates a new user account on the backend
  register: async (name, email, password) => {
    // set loading true and clear previous errors
    set({ loading: true, error: null });
    try {
      // call the register endpoint with provided info
      const res = await authApi.register({ name, email, password });
      // persist returned access token for session persistence
      localStorage.setItem("access_token", res.token);
      // update store with new user and token
      set({ user: res.user, token: res.token });
    } catch (err: any) {
      // log for debugging
      console.error("Register failed:", err);
      // get a friendly error message
      const errorMsg =
        err?.response?.data?.message || err.message || "Registration failed";
      // store the error for UI
      set({ error: errorMsg });
    } finally {
      // stop loading
      set({ loading: false });
    }
  },

  // ===== LOGOUT =====
  // function to log the user out both server-side (optional) and client-side
  logout: async () => {
    try {
      // try notifying server to invalidate session / revoke token (may be optional)
      await authApi.logout();
    } catch (err) {
      // warn but continue to clear client session even if server call fails
      console.warn("Logout error:", err);
    }
    // remove token from localStorage to prevent reuse after logout
    localStorage.removeItem("access_token");
    // clear user, token, and any error state in the store
    set({ user: null, token: null, error: null });
  },

  // ===== CHECK AUTH =====
  // function usually invoked on app startup to ensure auth is valid and load the current user
  checkAuth: async () => {
    // attempt to read token from memory first, then fallback to localStorage
    let token = get().token || localStorage.getItem("access_token");

    try {
      // if there is no token, try to refresh using the refresh endpoint (likely cookie-based)
      if (!token) {
        const refreshRes = await authApi.refresh();
        // extract the accessToken from refresh response
        token = refreshRes.accessToken;
        // if refresh didn't return a token, treat as failure
        if (!token) throw new Error("No access token returned");
        // persist new token locally
        localStorage.setItem("access_token", token);
        // update the in-memory token in the store
        set({ token });
      }

      // call an endpoint to get current user's profile using the (now available) token
      const meRes = await authApi.getMe(token);
      // update the store with the fetched user
      set({ user: meRes.user });
    } catch (err: any) {
      // initial attempt failed (invalid token, network issue, etc.)
      console.warn("Auth check failed, attempting refresh...", err);
      try {
        // try a refresh again to recover a valid session
        const refreshRes = await authApi.refresh();
        // extract token from refresh result
        token = refreshRes.accessToken;
        // ensure we received a token back
        if (!token) throw new Error("No access token returned");
        // persist the refreshed token
        localStorage.setItem("access_token", token);
        // update the in-memory store token
        set({ token });

        // fetch profile again with refreshed token
        const meRes = await authApi.getMe(token);
        // set user in store after successful refresh + profile fetch
        set({ user: meRes.user });
      } catch (refreshErr) {
        // refresh failed too — session can't be recovered client-side
        console.warn("Refresh token expired, logging out:", refreshErr);
        // call logout action (clears local state and localStorage)
        await get().logout();
      }
    }
  },
}));
