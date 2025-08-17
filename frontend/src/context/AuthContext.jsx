import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const API_URL = http://localhost:5000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ✅ Fetch user if token exists
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

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

    const login = async (email, password) => {
        try {
            setError('');
            setLoading(true);

            const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
                email,
                password,
            });

            if (response.data.success) {
                const { user, token } = response.data;
                setUser(user);
                setToken(token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/tasks'); // ✅ Move redirect here
            } else {
                throw new Error('Login failed');
            }
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError('Failed to log in. Please check your credentials.');
            setUser(null);
            setToken('');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Logout function
    const logout = () => {
        try {
            setError('');
            setUser(null);
            setToken('');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            setError('Failed to log out. Please try again.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, error, API_URL }}>
            {children}
        </AuthContext.Provider>
    );
};