import { useState } from "react";
import "./css/login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/header/authHeader";
import axiosClient from "../services/axiosClient";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();

        try {
            const response = await axiosClient.post("/Auth/login", {
                username: username,
                password: password,
            });

            console.log("Login success:", response);

            // Lưu token (nếu backend trả về)
            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            navigate("/create-product");

        } catch (error) {
            console.error("Login failed:", error);
            alert("Login thất bại! Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
        }
    };


    return (
        <div className="login-page">
            <AuthHeader/>

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