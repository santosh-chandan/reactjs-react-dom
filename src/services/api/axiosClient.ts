import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// --- Create base instance ---
const axiosBase = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com/v1",
  headers: { "Content-Type": "application/json" },
});

// --- Request interceptor: attach access token ---
axiosBase.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Response interceptor: unwrap `.data` and refresh token if needed ---
axiosBase.interceptors.response.use(
  (response: AxiosResponse) => response.data, // ✅ return only the data part
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized (401) with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Use raw axios to avoid recursion
          const res = await axios.post<{ access_token: string }>(
            `${import.meta.env.VITE_API_URL || "https://api.example.com/v1"}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const newToken = res.data.access_token;
          localStorage.setItem("access_token", newToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosBase(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }

    return Promise.reject(error);
  }
);

// --- Type-safe client definition ---
// (This ensures axiosClient.post<T> returns Promise<T>, not AxiosResponse<T>)
interface AxiosClient extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const axiosClient = axiosBase as AxiosClient;
export default axiosClient;
