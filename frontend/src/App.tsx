import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import StockPage from "./pages/StockPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App: React.FC = () => {
  return (
    <Router>
      <div data-theme="black">
        <Navbar />
        <div className="flex flex-1">
          <div className="flex-1 overflow-auto p-4">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/stock/:symbol" element={<StockPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
