import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login'
import ForgotPassword from './pages/forgot-pass'
import CreateAccount from './pages/create-account'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App
