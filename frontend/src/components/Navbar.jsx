import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="p-4 text-white sticky top-0 z-50 bg-base-100 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/" className="font-bold text-xl">
            Stocks Tracker
          </Link>
        </div>
        <span className="text-sm">Welcome back!</span>
      </div>
    </nav>
  );
};

export default Navbar;
