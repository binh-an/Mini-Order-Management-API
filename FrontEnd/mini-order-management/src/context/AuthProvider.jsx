import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextValue";
import axiosClient from "../services/axiosClient";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Decode token để UI có role ngay lập tức
          const decoded = jwtDecode(token);
          setUser({
            id: decoded.Id,
            username: decoded.Username,
            role: decoded.Role,
          });
        } catch {
          console.warn("Invalid token, clearing...");
          localStorage.removeItem("token");
        }
      }

      // Nếu có token thì fetch thêm thông tin user
      if (token) {
        try {
          const res = await axiosClient.get("/Auth/me");
          setUser(res);
          localStorage.setItem("role", res.role);
        } catch {
          localStorage.removeItem("token");
          setUser(null);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
