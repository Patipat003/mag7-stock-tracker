import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ChatSidebar from "./ChatSidebar";

interface DecodedToken {
  username?: string;
  email?: string;
}

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUsername(decoded.username || decoded.email || "User");
      } catch (err) {
        console.error("Invalid token", err);
        setUsername(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    alert("You have logged out.");
    navigate("/login");
  };

  return (
    <nav className="p-4 text-white sticky top-0 z-50 bg-base-100 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Stocks Tracker
        </Link>
        <div className="flex items-center space-x-4">
          {username ? (
            <>
              <span className="text-sm">Welcome back, {username}!</span>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline btn-error ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mx-2">Login</Link>
              <div className="divider divider-neutural divider-horizontal"></div>
              <Link to="/register" className="mx-2">Register</Link>
            </>
          )}
        </div>
        <ChatSidebar />
      </div>
    </nav>
  );
};

export default Navbar;
