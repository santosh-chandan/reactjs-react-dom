// Import axios library to make HTTP requests
import axios from "axios";

// Import TypeScript types from axios for better typing of configurations and responses
import type {
  AxiosInstance,              // full axios client instance type
  AxiosRequestConfig,         // type for config object passed to axios requests
  AxiosResponse,              // type for axios response
  InternalAxiosRequestConfig, // internal version used inside interceptors
} from "axios";

// --- Create base instance ---
// This is the main axios instance configured once and reused across your app.
const axiosBase = axios.create({
  // Define the base URL for all API requests.
  // It uses an environment variable from Vite (VITE_API_URL) or falls back to localhost.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4001/api",

  // Default headers for all requests — telling the server that we send JSON.
  headers: { "Content-Type": "application/json" },

  // Allow sending cookies along with requests (used for refresh tokens, sessions, etc.)
  withCredentials: true,
});

// --- Request interceptor: attach access token ---
// Before every request leaves the app, we can modify its config (e.g., add an auth header)
axiosBase.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Retrieve the access token stored in localStorage
  const token = localStorage.getItem("access_token");

  // If token exists, attach it as a Bearer token in the Authorization header
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Return the modified config so the request can continue
  return config;
});

// --- Response interceptor: unwrap `.data` and refresh token if needed ---
// This runs automatically after every response or error.
axiosBase.interceptors.response.use(
  // When the response is successful
  (response: AxiosResponse) => response.data, // Only return the `.data` portion, not full AxiosResponse

  // When there's an error (like 401 Unauthorized)
  async (error) => {
    // Keep the original request for retrying later
    const originalRequest = error.config;

    // Check if error is 401 (unauthorized) and request wasn’t already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // mark that we’re retrying this request once (to avoid infinite loops)
      originalRequest._retry = true;

      try {
        // Try to get the refresh token from localStorage
        const refreshToken = localStorage.getItem("refresh_token");

        // If a refresh token exists, try refreshing the access token
        if (refreshToken) {
          // Use plain axios (not axiosBase) to avoid recursive interceptor calls
          const res = await axios.post<{ access_token: string }>(
            `${import.meta.env.VITE_API_URL || "http://localhost:4001/api"}/auth/refresh`,
            { refresh_token: refreshToken } // send refresh_token in body
          );

          // Extract new access token from response
          const newToken = res.data.access_token;

          // Save the new token in localStorage for future requests
          localStorage.setItem("access_token", newToken);

          // Update the Authorization header in the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request with the updated Authorization header
          return axiosBase(originalRequest);
        }
      } catch (refreshError) {
        // If refresh request fails (refresh token invalid or expired)
        console.error("Token refresh failed:", refreshError);

        // Remove both tokens to force the user to log in again
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }

    // If no retry possible or still fails, reject the error for caller to handle
    return Promise.reject(error);
  }
);

// --- Type-safe client definition ---
// This ensures axiosClient.<method><T> returns Promise<T> instead of raw AxiosResponse<T>,
// making it easier to consume in components and services with TypeScript.
interface AxiosClient extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Cast our base axios instance to the strongly typed version
const axiosClient = axiosBase as AxiosClient;

// Export this axios client for use throughout the app
export default axiosClient;
