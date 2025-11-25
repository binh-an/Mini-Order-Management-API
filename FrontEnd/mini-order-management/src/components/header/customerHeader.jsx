// src/components/header/CustomerHeader.jsx
import { NavLink } from "react-router-dom";
import { IoIosAdd, IoIosHelpCircleOutline, IoIosPersonAdd } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";

export default function CustomerHeader({ openAddCustomerPopup }) {
  return (
    <header className="app-header">
      <div className="logo">Car Showroom</div>

      <div className="header-icons">
        <NavLink to="/order" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Order
        </NavLink>

        <NavLink to="/create-product" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Create
        </NavLink>

        <span className="icon" onClick={openAddCustomerPopup}>
          <IoIosAdd />
        </span>

        <NavLink to="/customer" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          <IoIosPersonAdd />
        </NavLink>

        <span className="icon"><IoIosHelpCircleOutline /></span>
        <span className="icon"><GrLanguage /></span>
        <span className="icon"><RxAvatar /></span>
      </div>
    </header>
  );
}
