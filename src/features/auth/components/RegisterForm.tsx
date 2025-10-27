import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

interface RegisterFormProps {
  redirectTo?: string; // optional redirect path (default: '/')
}

const RegisterForm: React.FC<RegisterFormProps> = ({ redirectTo = '/' }) => {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await register(form.name, form.email, form.password);
      navigate(redirectTo);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Unable to register. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white shadow-lg p-8 rounded-xl border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Create Account</h2>

      <div>
        <label className="block mb-1 text-gray-600">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Email</label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-600">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition disabled:bg-gray-400"
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>

      <p className="text-center text-gray-500 text-sm mt-3">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
