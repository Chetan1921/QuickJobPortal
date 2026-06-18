import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { GetCompleteUserDetailbyUserId } from "../utils/db.js";

dotenv.config();

interface User {
    id: number,
    name: string,
    email: string,
    phone_number: string,
    role: "job_seeker" | "recruiter",
    bio: string | null,
    resume: string | null,
    resume_public_id: string | null,
    profile_picture: string | null,
    profile_picture_public_id: string | null,
    skills: string[],
    subscription: string | null
}

export interface AuthenticatedRequest extends Request {
    user?: User
}
export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authorization Header is missing or invalid'
            })
            return;
        }
        const token = authHeader.split(' ')[1];
        const decodetoken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decodetoken || !decodetoken.id) {
            res.status(401).json({
                success: false,
                message: 'Authorization Header is missing or invalid'
            })
            return;
        }

        const users = await GetCompleteUserDetailbyUserId(decodetoken.id);
        if (users.length === 0) {
            res.status(401).json({
                success: false,
                message: 'User Associated with this token no longer exsists'
            })
            return;
        }
        const user = users[0] as User;
        user.skills = user.skills || []
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            success: false,
            message: "Login Failed Please login Again"
        })
    }

}