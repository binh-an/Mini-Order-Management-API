import { NavLink } from "react-router-dom";
import { IoIosAdd, IoIosPersonAdd, IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";

export default function AddProductHeader({ openAddProductPopup, openAddCustomerPopup }) {
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

        {/* Add Product */}
        <span className="icon" onClick={openAddProductPopup}><IoIosAdd /></span>

        {/* Add Customer */}
        <span className="icon" onClick={openAddCustomerPopup}><IoIosPersonAdd /></span>

        <span className="icon"><IoIosHelpCircleOutline /></span>
        <span className="icon"><GrLanguage /></span>
        <span className="icon"><RxAvatar /></span>
      </div>
    </header>
  );
}
