import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill out both fields.");
      return;
    }

    setError(null);

    try {
      await registerUser(username, password);
      setSuccess("Registration successful!");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <div className="card-body">
          <fieldset className="fieldset">
            <label className="label">Username</label>
            <input 
              type="username" 
              className="input w-full" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input w-full" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              className="btn btn-neutral mt-4"
              onClick={handleRegister}
            >
              Register
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
