import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const isLoggedIn = !!user;

  return (
    <header className="w-full shadow-md">
      {/* --- Top Header --- */}
      <div className="w-screen bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Left: Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-blue-100 transition"
          >
            ReactTailwindApp
          </Link>

          {/* Right: Search + Auth Buttons */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex items-center bg-blue-500 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 w-48 bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
              />
              <button className="px-3 py-2 hover:bg-blue-400 transition">
                <Search size={18} />
              </button>
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                {/* 👇 Profile link (only when logged in) */}
                <Link
                  to="/profile"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition"
                >
                  {user?.name ? `Hi, ${user.name}` : "Profile"}
                </Link>

                <button
                  onClick={logout}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Bottom Navbar Strip --- */}
      <div className="w-screen bg-blue-500 text-white border-t border-blue-400 shadow-inner">
        <nav className="max-w-4xl mx-auto px-6">
          <ul className="flex items-center gap-8 py-3">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
              ...(isLoggedIn ? [{ path: "/profile", label: "Profile" }] : []), // 👈 Conditionally add
            ].map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-lg hover:text-blue-100 transition ${
                      isActive
                        ? "text-white font-semibold border-b-2 border-blue-200 pb-1"
                        : ""
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
