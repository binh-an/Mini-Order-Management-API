import { useState } from "react";
import "../../style/login.css";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../components/header/authHeader";
import { jwtDecode } from "jwt-decode";
import { login } from "../../api/AuthApi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login request...");
      
      const response = await login(username, password);

      console.log("Raw response:", response);

      const token = response.token || response.data?.token;

      if (!token) {
        console.error("Token extraction failed!", response);
        alert("Login thất bại! Token không tồn tại.");
        return;
      }

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage:", token.substring(0, 20) + "...");

      // Decode JWT để lấy role
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "user";
      localStorage.setItem("role", role);
      console.log("Decoded role:", role);

      // Điều hướng sau khi login
      navigate("/order");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login thất bại! Vui lòng kiểm tra tài khoản và mật khẩu.");
    }
  };

  return (
    <div className="login-page">
      <AuthHeader />

      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign in</h2>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="btn-signin">
            Sign In
          </button>

          <div className="form-bottom-links">
            <Link to="/forgot-pass" className="link">
              Forgot password?
            </Link>
            <br />
            <Link to="/create" className="link">
              Don't have an account?
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
