import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({success: false, message: "Missing User Details"})
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
           return res.status(409).json({success: false, message: "User already exists"})
        }

        const hashedpassword = await bcrypt.hash(password,10);

        const user = await User.create({name, email, password: hashedpassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true, //prevent js to access cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
        })
  
         return res.status(201).json({success: true, user: {_id: user._id, name: user.name, email: user.email, createdAt: user.createdAt}})

    } catch (error) {
        console.error("Registration error: ",error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}

//Login User : /api/user/login
export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({success:false, message:'Email and password are required !'});
        }
        
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({success:false, message:'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
           return res.status(400).json({success:false, message:'Password'});
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })
  
         return res.status(201).json({success: true, user: {_id: user._id, name: user.name, email: user.email, createdAt: user.createdAt}})

    } catch (error) {
         console.error("Login error: ",error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}