import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width header */}
      <Header />

      {/* Centered main content area */}
      <main className="grow max-w-7xl mx-auto px-6 py-8 w-full">
        <Outlet />
      </main>

      {/* Full-width footer */}
      <Footer />
    </div>
  );
};

export default Layout;
