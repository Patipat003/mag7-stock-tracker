import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuChartNoAxesCombined } from "react-icons/lu";

const Navbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="p-4 text-white sticky top-0 z-50 backdrop-blur bg-base-100/60 shadow-lg overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/" className="font-bold text-2xl">
            <div className="flex justify-center items-center gap-3">
              <LuChartNoAxesCombined />
              Stocks
            </div>
          </Link>
        </div>
        <p className="font-semibold text-sm">{time.toLocaleString()}</p>
      </div>
    </nav>
  );
};

export default Navbar;
