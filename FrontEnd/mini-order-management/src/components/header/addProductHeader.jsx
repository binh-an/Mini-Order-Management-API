import { NavLink } from "react-router-dom";
import { IoIosAdd, IoIosPersonAdd, IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";

export default function AddProductHeader({ openAddProductPopup, onSearch }) {
  return (
    <header className="app-header">
      <div className="left-header">
        <div className="logo">Car Showroom</div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch(e.target.value.trim());
              }
            }}
          />
          <button onClick={() => onSearch("")}>Show All</button>
        </div>
      </div>


      <div className="header-icons">
        <NavLink to="/order" className={({ isActive }) => "icon link" + (isActive ? " active" : "")}>
          Order
        </NavLink>

        <NavLink to="/order-list" className={({isActive}) => "icon link" + (isActive ? " active" : "")}>
          Order List
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
