import { useState } from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import "./css/login.css"; // vẫn dùng CSS cũ, có thể chỉnh nếu cần
import { useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();  

  const handleConfirm = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("New Password:", newPassword);
    // sau này: gọi API đổi mật khẩu
    navigate("/");
  };
  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo">Car Showroom</div>
        <div className="header-icons">
            <span className="icon"><IoIosHelpCircleOutline /></span>
            <span className="icon"><GrLanguage /></span>
        </div>
      </header>

      <main className="login-main">
        <form className="login-form" onSubmit={handleConfirm}>
          <h2>Reset Password</h2>

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
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-signin">Confirm</button>
        </form>
      </main>
    </div>
  );
}