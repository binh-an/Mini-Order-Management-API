import { createContext, useState, useEffect } from "react";

// Tạo context
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Chứa info: username, email, token
  const [token, setToken] = useState(null);

  // Khi load trang, lấy token nếu đã login trước đó
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Hàm login — sẽ gọi từ authService
  const loginUser = (data) => {
    setUser({
      username: data.username,
      email: data.email
    });
    setToken(data.token);

    // lưu vào localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ username: data.username, email: data.email })
    );
  };

  // Hàm logout
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
