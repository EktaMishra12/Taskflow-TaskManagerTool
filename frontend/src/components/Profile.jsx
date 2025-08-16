import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, token, API_URL, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        `${API_URL}/users/me`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        login(response.data.user, token); // Update context with new user data
        toast.success('Profile updated successfully');
        navigate('/tasks');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-100 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-[1.01] transition duration-300">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6 flex items-center justify-center gap-2 drop-shadow">
          <FiUser /> Profile
        </h2>
        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        {loading && <p className="text-center text-gray-600 mb-4">Loading...</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg disabled:opacity-50"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;