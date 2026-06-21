import TryCatch from "../middleware/TryCatch.js";
import ErrorHandler from "../utils/ErrorHandle.js";
import { GetUserByEmail, UpdateUserPass, RegisterRecruiter, RegisterJobSeeker, GetCompleteUserDetail } from "../utils/db.js";
import bcrypt from 'bcrypt';
import GetBufferFromFile from "../utils/Buffer.js";
import axios from "axios";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
// import { SendMessage } from "../kafka/producer.js";
import { ForgotPasswordTemplate } from "../utils/template.js";
import nodemailer from 'nodemailer';
import { RedisClient } from "../index.js";
dotenv.config();
export const RegisterController = TryCatch(async (req, res, next) => {
    console.log("Received registration request with body:", req.body);
    const { name, email, password, phoneNo, role, bio } = req.body;
    if (!name || !email || !password || !phoneNo || !role || !bio) {
        throw new ErrorHandler("All fields are required", 400);
    }
    const exsistingUser = await GetUserByEmail(email);
    console.log(exsistingUser);
    if (exsistingUser.length > 0) {
        throw new ErrorHandler("User with this email already exists", 400);
    }
    let registeredUser;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (role === 'recruiter') {
        const user = await RegisterRecruiter(name, email, hashedPassword, phoneNo, role);
        registeredUser = user[0];
    }
    else if (role === 'job_seeker') {
        // req.file is added by multer; cast req to any to avoid TypeScript error
        const file = req.file; // handle jobseeker registration with file if needed 
        if (!file) {
            throw new ErrorHandler("Resume file is required for jobseekers", 400);
        }
        const fileBuffer = await GetBufferFromFile(file);
        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler("Error processing the resume file", 500);
        }
        const { data } = await axios.post(process.env.UPLOAD_SERVICE + '/api/v1/utils/upload', {
            buffer: fileBuffer.content,
        });
        const user = await RegisterJobSeeker(name, email, hashedPassword, phoneNo, role, bio, data.url, data.public_id);
        registeredUser = user[0];
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new ErrorHandler("JWT_SECRET is not set", 500);
    }
    const token = jwt.sign({ id: registeredUser?.id }, jwtSecret, { expiresIn: '15d' });
    return res.status(200).json({
        success: true,
        message: "User Registered Successfully1",
        user: registeredUser,
        token: token
    });
});
export const LoginController = TryCatch(async (req, res, next) => {
    console.log("Body:", req.body);
    const { email, password } = req.body;
    if (!password || !email) {
        throw new ErrorHandler("All Fields are Required", 400);
    }
    const user = await GetCompleteUserDetail(email);
    // Check Weather User Exsist Or not
    console.log("User", user);
    if (user.length === 0) {
        throw new ErrorHandler("User not Not Found Please Complete The Registration Process", 400);
    }
    const userObject = user[0];
    console.log("Entered Password:", password);
    console.log("DB Password:", userObject.password);
    const matchedPassword = await bcrypt.compare(password, userObject.password);
    console.log("Matched:", matchedPassword);
    if (!matchedPassword) {
        throw new ErrorHandler("Invalid Credential", 400);
    }
    userObject.skills = userObject.skills || [];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new ErrorHandler("JWT_SECRET is not set", 500);
    }
    const token = jwt.sign({ id: userObject.id }, jwtSecret, { expiresIn: '15d' });
    const { password: _, ...safeUser } = userObject;
    return res.status(200).json({
        success: true,
        user: safeUser,
        token
    });
});
export const ForgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ErrorHandler("Email Id is Missing", 400);
    }
    const user = await GetUserByEmail(email);
    if (user.length === 0) {
        return res.status(200).json({
            message: `No User Registered with The Email: ${email}`
        });
    }
    const requiredUser = user[0];
    const jwtsecret = process.env.JWT_SECRET;
    const resetToken = jwt.sign({ email: requiredUser.email, type: "reset" }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    const html = ForgotPasswordTemplate({
        name: requiredUser.name,
        resetLink: resetLink,
    });
    await RedisClient.set(`forgot:${email}`, resetToken, {
        EX: 1800
    });
    const message = {
        to: requiredUser.email,
        subject: 'RESET YOUR PASSWORD --HIRETALENT',
        html: html
    };
    // Send Reset Link to Redis Client
    // // console.log("message", message)
    // const topic = 'send-mail'
    // await SendMessage(topic, message)
    // Commented out Kafka Logic for Deployement
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    await transporter.sendMail({
        from: 'chetan.sharma200104022@gmail.com',
        to: message.to,
        subject: message.subject,
        html: message.html
    });
    console.log("Mail Sent to ", message.to);
    return res.status(200).json({
        success: true,
        message: 'We have sent A ResetLink to Your Email',
    });
});
export const ResetPassword = TryCatch(async (req, res, next) => {
    // extract token param (expecting route like /reset/:token)
    const { token } = req.params;
    const { password } = req.body;
    // Decode the token
    let decode;
    try {
        if (!token)
            throw new ErrorHandler('Token is missing', 400);
        decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
    }
    catch (err) {
        console.log(err);
    }
    if (decode.type !== 'reset') {
        throw new ErrorHandler("Invalid token type", 400);
    }
    const email = decode.email;
    const storedtoken = await RedisClient.get(`forgot:${email}`);
    if (!storedtoken || storedtoken !== token) {
        throw new ErrorHandler("Token has Expired", 400);
    }
    const users = await GetUserByEmail(email);
    if (users.length === 0) {
        throw new ErrorHandler("Invalid user", 400);
    }
    const user = users[0];
    const hashedpassword = await bcrypt.hash(password, 10);
    await UpdateUserPass(email, hashedpassword);
    await RedisClient.del(`forgot:${email}`);
    return res.status(200).json({
        success: true,
        message: 'Password Changed Successfully'
    });
});
