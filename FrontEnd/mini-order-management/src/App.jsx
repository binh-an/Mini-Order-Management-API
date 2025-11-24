import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";

import Login from './pages/login'
import ForgotPassword from './pages/forgot-pass'
import CreateAccount from './pages/create-account'
import CreateProduct from "./pages/create-product";
import Order from "./pages/order";
import Cart from "./pages/cart";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create" element={<CreateAccount />} />
          <Route path="/forgot-pass" element={<ForgotPassword />} />
          <Route path="/create-product" element={<CreateProduct/>}/>
          <Route path="/order" element={<Order/>}></Route>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
