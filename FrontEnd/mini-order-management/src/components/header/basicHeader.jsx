import { NavLink, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextValue";

export default function BasicHeader( {onSearch}) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleCreateClick = () => {  
    console.log(user);
    console.log("Role:", role);


    if (role !== "Admin") {
      alert("Bạn không có quyền truy cập trang này!");
      return;
    }
    navigate("/create-product");
  };

  return (
    <header className="app-header">
      <div className="left-header">
        <div className="logo">Car Showroom</div>

        {/* SEARCH BOX */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search ..." 
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

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

        <NavLink
          to="/order-list"
          className={({ isActive }) => "icon link" + (isActive ? " active" : "")}
        >
          Order List
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
