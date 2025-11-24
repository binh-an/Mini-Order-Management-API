import { NavLink, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextValue";

export default function BasicHeader() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreateClick = () => {  
    console.log(user);

    if (user?.role === "Admin") {
      // đúng quyền → cho vào
      navigate("/create-product");
    } else {
      // không đúng quyền → cảnh báo + đứng yên
      alert("Bạn không có quyền truy cập trang này!");
    }
  };

  return (
    <header className="app-header">
      <div className="logo">Car Showroom</div>

      <div className="header-icons">
        <NavLink 
          to="/cart" 
          className={({ isActive }) => "icon link" + (isActive ? " active" : "")}
        >
          <IoCartOutline />
        </NavLink>

        <NavLink 
          to="/order" 
          className={({ isActive }) => "icon link" + (isActive ? " active" : "")}
        >
          Order
        </NavLink>

        {/* CREATE — xử lý click thủ công */}
        <span 
          onClick={handleCreateClick}
          className="icon link" 
          style={{ cursor: "pointer" }}
        >
          Create
        </span>

        <span className="icon"><IoIosHelpCircleOutline /></span>
        <span className="icon"><GrLanguage /></span>
        <span className="icon"><RxAvatar /></span>
      </div>
    </header>
  );
}
