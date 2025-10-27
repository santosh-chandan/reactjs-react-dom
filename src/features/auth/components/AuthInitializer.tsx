import React, { useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import authApi from "../../../services/api/authApi";

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
  const initAuth = async () => {
    try {
      const refreshRes = await authApi.refresh();
      const newAccessToken = refreshRes.accessToken;
      console.log("New access token:", newAccessToken);
      if (!newAccessToken) throw new Error("No access token returned");
      setToken(newAccessToken);

      const meRes = await authApi.getMe(newAccessToken);
      setUser(meRes.user);
    } catch (err) {
      console.warn("Auth initialization failed:", err);
      setUser(null);
      setToken(null);
    }
  };

  initAuth();
}, [setUser, setToken]);


  return <>{children}</>;
};

export default AuthInitializer;
