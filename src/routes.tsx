//import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import LoginPage from './features/auth/pages/LoginPage.tsx';
import RegisterPage from './features/auth/pages/RegisterPage.tsx';
import UserProfilePage from './features/user/pages/UserProfilePage.tsx';

// Define nested routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Common layout for all child routes
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <UserProfilePage /> },
    ],
  },
]);
