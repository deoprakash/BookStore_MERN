import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_token';

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token missing.'
        })
    }

    const token = authHeader.split(' ')[1];

    try{
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password')
        if(!user) {
           return res.status(401).json({
            success:false,
            message: 'User not found'
           });
        }
        req.user = user;
        next();
    }

    catch (error) {
        console.error('JWT verification');
        return res.status(500).json({
            success: false,
            message: 'Token invalid or expired.'
        })

    }
}