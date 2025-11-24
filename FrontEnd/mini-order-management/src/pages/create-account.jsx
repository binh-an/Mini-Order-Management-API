import { useState } from "react";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthHeader from "../components/header/authHeader";
import axiosClient from "../services/axiosClient";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agree) return;
    try {
      //Register
      await axiosClient.post("/Auth/register", { username, email, password });
      console.log("Register success");

      await new Promise(resolve => setTimeout(resolve, 300));

      //Login after register
      const loginRes = await axiosClient.post("/Auth/login", { username, password });
      console.log("Full login response:", loginRes);
      if (!loginRes.token) throw new Error("Login fail sau register");

      //Lưu token
      localStorage.setItem("token", loginRes.token);
      navigate("/order");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data || err.message || "Lỗi đăng ký hoặc đăng nhập");
    }
  };


  return (
    <div className="login-page">
      <AuthHeader/>

      <main className="login-main">
        <form className="login-form" onSubmit={handleRegister}>
          <h2>Create Account</h2>

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
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="agree">Agree to ours Privacy & Terms</label>
          </div>

          <button type="submit" className="btn-signin" disabled={!agree}>Create</button>

          <div className="form-bottom-links">
            <Link to="/" className="link">Already have an account?</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
