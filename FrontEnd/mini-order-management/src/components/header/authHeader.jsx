import { IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import "../../style/login.css";

export default function AuthHeader() {
  return (
    <header className="login-header">
      <div className="logo">Car Showroom</div>
      <div className="header-icons">
        <span className="icon"><IoIosHelpCircleOutline /></span>
        <span className="icon"><GrLanguage /></span>
      </div>
    </header>
  );
}
