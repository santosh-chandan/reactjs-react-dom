// src/features/auth/components/LoginForm.tsx
import React, { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Sign In
      </h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="border rounded-lg px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          className="border rounded-lg px-3 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
