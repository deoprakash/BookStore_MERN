import userModel from "../models/UserModel";
import validator from 'validator'

// REGISTER FUNCTION

export async function registerUser(req, req) {
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
            message: 'Password must be atealst 8 characters.'
        })
    }
}