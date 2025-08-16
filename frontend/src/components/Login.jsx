import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiLogIn } from "react-icons/fi";
import toast from "react-hot-toast";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, API_URL } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/login`, formData);
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success("Login successful");
        navigate("/tasks");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-[1.01] transition duration-300">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6 flex items-center justify-center gap-2 drop-shadow">
          <FiLogIn /> Login
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700" htmlFor="login-email">Email</label>
            <input
            id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="login-password">Password</label>
            <input
            id="login-password" 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;