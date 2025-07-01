import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import StockPage from "./pages/StockPage";
import { StockProvider } from "./contexts/StockContext";

const App = () => {
  return (
    <StockProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/stock/:symbol" element={<StockPage />} />
        </Routes>
      </Router>
    </StockProvider>
  );
};

export default App;
