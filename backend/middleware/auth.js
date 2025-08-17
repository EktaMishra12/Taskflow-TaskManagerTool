/* auth.js - WITH DEBUG LOGS */
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
console.log('JWT_SECRET being used:', JWT_SECRET); // Debug log

export default async function authMiddleware(req, res, next) {
    console.log('=== AUTH MIDDLEWARE CALLED ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('All headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ No valid Bearer token found');
        return res.status(401).json({ success: false, message: 'Unauthorized, token missing' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    console.log('Token length:', token.length);

    // Verify the token
    try {
        console.log('🔍 Verifying token with JWT_SECRET...');
        const payload = jwt.verify(token, JWT_SECRET);
        console.log('✅ JWT payload:', payload);
        
        console.log('🔍 Looking for user with ID:', payload.id);
        const user = await User.findById(payload.id).select('-password');
        console.log('Found user:', user ? 'YES' : 'NO');
        console.log('User details:', user);

        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        req.user = user; // Attach full user object
        console.log('✅ User attached to request, proceeding to next middleware');
        next();
    } catch (err) {
        console.error("❌ JWT verification failed:", err.name, err.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}