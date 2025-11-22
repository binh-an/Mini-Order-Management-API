import { useState } from "react";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthHeader from "../components/header/authHeader";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  
  const handleCreate = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Agreed:", agree);
    // gọi API tạo account ở đây
    navigate("/");
  };

  return (
    <div className="login-page">
      <AuthHeader/>

      <main className="login-main">
        <form className="login-form" onSubmit={handleCreate}>
          <h2>Create Account</h2>

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

          <button type="submit" className="btn-signin">Create</button>

          <div className="form-bottom-links">
            <Link to="/" className="link">Already have an account?</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
