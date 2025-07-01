import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import StockPage from "./pages/StockPage";

const App = () => {
  return (
    <Router>
      <div data-theme="black">
        <Navbar />
        <div className="flex flex-1">
          <div className="flex-1 h-screen overflow-auto p-4">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/stock/:symbol" element={<StockPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
