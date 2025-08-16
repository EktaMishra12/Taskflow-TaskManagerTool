import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogIn, FiLogOut, FiUserPlus } from 'react-icons/fi';
import { FaTasks } from 'react-icons/fa';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
   <nav className="bg-blue-600 p-4 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-2xl font-extrabold tracking-tight flex items-center gap-2 drop-shadow-md hover:scale-[1.02] transition-transform"
        >
          <FaTasks /> TaskFlow
        </Link>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link
                to="/tasks"
                className="text-white flex items-center gap-1 hover:underline hover:scale-105 transition-transform"
              >
                <FaTasks /> Tasks
              </Link>
              <Link
                to="/profile"
                className="text-white hover:underline hover:scale-105 transition-transform"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-white flex items-center gap-1 hover:underline hover:scale-105 transition-transform"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white flex items-center gap-1 hover:underline hover:scale-105 transition-transform"
              >
                <FiLogIn /> Login
              </Link>
              <Link
                to="/register"
                className="text-white flex items-center gap-1 hover:underline hover:scale-105 transition-transform"
              >
                <FiUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;