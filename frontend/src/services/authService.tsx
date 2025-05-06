import axios from "axios";

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post("http://localhost:5000/register", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Registration failed.");
  }
};

interface LoginResponse {
  token: string;
}

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>("http://localhost:5000/login", {
      username,
      password,
    });

    const token = response.data.token;

    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return response.data;
  } catch (error) {
    throw new Error("Login failed.");
  }
};