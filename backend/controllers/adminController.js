import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_token';
const TOKEN_EXPIRES = '24h';

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    } catch (err) {
        next(err);
    }
};
