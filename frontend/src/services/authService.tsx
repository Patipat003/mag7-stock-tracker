import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, {
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
    const response = await axios.post<LoginResponse>(`${apiUrl}/login`, {
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