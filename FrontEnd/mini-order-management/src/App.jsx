import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { CartProvider } from "./context/CartContext";

import Login from './pages/Auth/login'
import ForgotPassword from './pages/Auth/forgot-pass'
import CreateAccount from './pages/Auth/create-account'
import CreateProduct from "./pages/create-product";
import Order from "./pages/order";
import Cart from "./pages/cart";
import Customer from "./pages/customer";
import OrderList from "./pages/orderList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/create" element={<CreateAccount />} />
            <Route path="/forgot-pass" element={<ForgotPassword />} />
            <Route path="/create-product" element={<CreateProduct/>}/>
            <Route path="/order" element={<Order/>}></Route>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/customer" element={<Customer />} />
            <Route path="/order-list" element={<OrderList />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
