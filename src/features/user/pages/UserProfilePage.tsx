// src/features/user/pages/UserProfilePage.tsx
import React, { useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const UserProfilePage: React.FC = () => {
  const { user, fetchUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button
        onClick={logout}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfilePage;
