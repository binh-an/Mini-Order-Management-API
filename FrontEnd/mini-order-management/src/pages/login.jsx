import { useState } from "react";
import "./css/login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/header/authHeader";
import { useAuth } from "../context/AuthContext";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);
        login(email, password, remember)
            .then(() => {
                navigate("/create-product");
            })
            .catch((err) => {
                console.error(err);
                const msg = err?.message || err?.error || JSON.stringify(err);
                setError(msg);
            });
    };

    return (
        <div className="login-page">
            <AuthHeader/>

            <main className="login-main">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Sign in</h2>

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
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember">Remember me</label>
                    </div>

                    <button type="submit" className="btn-signin">Sign In</button>

                    {error && <div className="form-error" style={{color:'red', marginTop:8}}>{error}</div>}

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