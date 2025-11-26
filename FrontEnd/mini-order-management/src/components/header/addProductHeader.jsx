import { NavLink } from "react-router-dom";
import { IoIosAdd, IoIosPersonAdd, IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";

export default function AddProductHeader({ openAddProductPopup }) {
  return (
    <header className="app-header">
      <div className="logo">Car Showroom</div>

      <div className="header-icons">
        <NavLink to="/order" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Order
        </NavLink>

        <NavLink to="/order-list" className={({isActive}) => "icon link" + (isActive ? " active" : "")}>
          Lists
        </NavLink>

        <NavLink to="/create-product" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Create
        </NavLink>

        {/* Add Product */}
        <span className="icon" onClick={openAddProductPopup}><IoIosAdd /></span>

        {/* Add Customer */}
        <NavLink to="/customer" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          <IoIosPersonAdd/>
        </NavLink>

        <span className="icon"><IoIosHelpCircleOutline /></span>
        <span className="icon"><GrLanguage /></span>
        <span className="icon"><RxAvatar /></span>
      </div>
    </header>
  );
}
