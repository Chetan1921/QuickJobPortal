import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GetCompleteUserDetailbyUserId } from "../utils/db.js";
dotenv.config();
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authorization Header is missing or invalid'
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodetoken || !decodetoken.id) {
            res.status(401).json({
                success: false,
                message: 'Authorization Header is missing or invalid'
            });
            return;
        }
        const users = await GetCompleteUserDetailbyUserId(decodetoken.id);
        if (users.length === 0) {
            res.status(401).json({
                success: false,
                message: 'User Associated with this token no longer exsists'
            });
            return;
        }
        const user = users[0];
        user.skills = user.skills || [];
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Login Failed Please login Again"
        });
    }
};
