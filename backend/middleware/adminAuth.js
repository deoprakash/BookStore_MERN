import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_token';

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized as admin.' });
        }

        next();
    } catch (err) {
        console.error('Admin Auth Middleware Error:', err);
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

export default adminAuth;
