import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await checkAuth();   // call Zustand's checkAuth
      setLoading(false);
    })();
  }, [checkAuth]);

  if (loading) {
    // optional splash/loading screen
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthInitializer;
