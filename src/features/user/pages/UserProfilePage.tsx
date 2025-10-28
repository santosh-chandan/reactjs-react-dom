// src/features/user/pages/UserProfilePage.tsx
import React, { useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const UserProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // ✅ just render nothing while redirecting

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.name}</p>
    </div>
  );
};

export default UserProfilePage;
