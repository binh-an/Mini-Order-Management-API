import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login'
import ForgotPassword from './pages/forgot-pass'
import CreateAccount from './pages/create-account'
import CreateProduct from "./pages/create-product";
import Order from "./pages/order";
import Cart from "./pages/cart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />
        <Route path="/create-product" element={<CreateProduct/>}/>
        <Route path="/order" element={<Order/>}></Route>
        <Route path="/cart" element={<Cart/>}/>
      </Routes>
    </Router>
  );
}

export default App
