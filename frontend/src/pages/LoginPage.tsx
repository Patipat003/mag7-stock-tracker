import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill out both fields.");
      return;
    }

    setError(null);

    try {
      const response = await loginUser(username, password);
      const token = response.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      setSuccess("Login successful!");
      setUsername("");
      setPassword("");
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      setError("Login failed. Please try again.");
    }
  };  

  return (
    <div className="flex justify-center h-screen">
      <div className="hero-content lg:flex-row-reverse flex-col gap-8">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome to Stock Chat!</h1>
          <p className="py-6">Join us to chat about stocks and trading.</p>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label">Username</label>
              <input 
                type="username" 
                className="input" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="label">Password</label>
              <input 
                type="password" 
                className="input" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">Don't have an account? <a href="/register" className="text-blue-500">Register here</a></p>
              <button 
                className="btn btn-neutral mt-4"
                onClick={handleLogin}
              >
                Login</button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
