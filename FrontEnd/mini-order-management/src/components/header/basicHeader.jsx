import { NavLink } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";

export default function BasicHeader() {
  return (
    <header className="app-header">
      <div className="logo">Car Showroom</div>

      <div className="header-icons">
        <NavLink to="/cart" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          <IoCartOutline />
        </NavLink>

        <NavLink to="/order" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Order
        </NavLink>

        <NavLink to="/create-product" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Create
        </NavLink>

        <span className="icon"><IoIosHelpCircleOutline /></span>
        <span className="icon"><GrLanguage /></span>
        <span className="icon"><RxAvatar /></span>
      </div>
    </header>
  );
}
