import userModel from "../models/UserModel.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_token';
const TOKEN_EXPIRES = '24h';

// TOKEN GENERATION

const createToken = (userId) => 
    jwt.sign({id: userId}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES });

// REGISTER FUNCTION

export async function registerUser(req, res) {
    const {username, email, password} = req.body;
    
    if (!username || !email || !password){
        return  res.status(400).json({success: false, message: "All field are required"})
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false, 
            message:'Invalid email'
        })
    }

    if (password.length < 8){
        return res.status(400).json({
            success: false,
            message: 'Password must be atleast 8 characters.'
        })
    }

    try {
        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.'
            })
        }
        const hashedPassword =  await bcrypt.hash(password, 10) //salt value is 10 means how many times does a password should be hashed.

        const user = await userModel.create({
            name: username,
            email,
            password: hashedPassword,
        })
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Acound Created Successfully',
            token,
            user: {
                id: user._id,
                username: user.name,
                email: user.email,
            }
        })
    }

    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error.'
        })
        
    }
}

// LOGIN FUNCTION

export async function loginUser (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        })
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            })
        }

        const token = createToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login Successfull!',
            token,
            user: {
                id: user._id,
                username: user.name,
                email: user.email,
            }
        })
    }

    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error.'
        })
        
    }
}