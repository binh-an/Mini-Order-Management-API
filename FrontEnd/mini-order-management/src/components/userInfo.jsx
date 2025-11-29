import { useState } from "react";
import { RxAvatar } from "react-icons/rx";

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    // Nếu chưa có user, render icon avatar đơn giản
    return (
      <div className="user-menu-wrapper" style={{ position: "relative" }}>
        <span className="icon avatar-icon">
          <RxAvatar />
        </span>
      </div>
    );
  }

  return (
    <div className="user-menu-wrapper" style={{ position: "relative" }}>
      <span className="icon avatar-icon" onClick={() => setOpen(!open)}>
        <RxAvatar />
      </span>

      {open && (
        <div className="user-menu">
          <div className="user-row"><b>Role:</b> {user.role}</div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
