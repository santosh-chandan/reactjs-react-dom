import axiosClient from "./axiosClient";
import type { User } from "../types/user";

const userApi = {
  // GET /users/me
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get<User>("/users/me");
    return response; // ✅ already the data
  },

  // PUT /users/me
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosClient.put<User>("/users/me", data);
    return response;
  },

  // GET /users/:id (admin use)
  getById: async (id: number): Promise<User> => {
    const response = await axiosClient.get<User>(`/users/${id}`);
    return response;
  },
};

export default userApi;
