import { useState } from "react";
import "./css/login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/header/authHeader";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Remember me:", remember);
        // sau này: gọi API login
        navigate("/create-product");
    };

    return (
        <div className="login-page">
            <AuthHeader/>

            <main className="login-main">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Sign in</h2>

                    <div className="form-group">
                        <label>Emaill</label>
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
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember">Remember me</label>
                    </div>

                    <button type="submit" className="btn-signin">Sign In</button>

                    <div className="form-bottom-links">
                        <Link to="/forgot-pass" className="link">Forgot password?</Link>
                        <br />
                        <Link to="/create" className="link">Don't have an account?</Link>
                    </div>
                </form>
            </main>
        </div>
    );
}