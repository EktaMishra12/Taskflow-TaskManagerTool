import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Tasks from './components/Tasks';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-300 to-purple-200">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto p-8">
                <div className="bg-white rounded-xl shadow-2xl p-10 text-center transform hover:scale-[1.01] transition duration-300">
                  <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-lg">
                    Welcome to TaskFlow
                  </h1>
                  <p className="text-gray-600 mt-4 text-lg">
                    Manage your tasks efficiently and stylishly.
                  </p>
                </div>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;