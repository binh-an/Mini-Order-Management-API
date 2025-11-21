import { useState } from "react";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthHeader from "../components/header/authHeader";
import { useAuth } from "../context/AuthContext";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const handleCreate = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Agreed:", agree);
    // call register and auto-login (AuthContext will try to auto-login)
    register(email, email, password)
      .then(() => {
        // if register auto-logged in, go to create-product, else go to login
        if (isAuthenticated) navigate("/create-product");
        else navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert(err?.message || JSON.stringify(err));
      });
  };

  return (
    <div className="login-page">
      <AuthHeader/>

      <main className="login-main">
        <form className="login-form" onSubmit={handleCreate}>
          <h2>Create Account</h2>

          <div className="form-group">
            <label>Username</label>
            <input
              type="username"
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

          <button type="submit" className="btn-signin">Create</button>

          <div className="form-bottom-links">
            <Link to="/" className="link">Already have an account?</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
