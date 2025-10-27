// src/features/auth/pages/LoginPage.tsx
import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
