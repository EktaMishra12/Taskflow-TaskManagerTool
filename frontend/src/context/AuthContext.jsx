import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

// ✅ Move this to the top
const API_URL = import.meta.env.VITE_BACKEND_URL;
console.log('API_URL:', API_URL);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    throw new Error('Invalid response');
                }
            } catch (err) {
                console.error('Fetch user error:', err);
                setError('Failed to verify user. Please log in again.');
                setUser(null);
                setToken('');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (userData, authToken) => {
        try {
            setError('');
            setLoading(true);
            setUser(userData);
            setToken(authToken);
            localStorage.setItem('token', authToken);
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to log in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        try {
            setError('');
            setLoading(true);
            setUser(null);
            setToken('');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            setError('Failed to log out. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, error, API_URL }}>
            {children}
        </AuthContext.Provider>
    );
};