import express from 'express'
import { RegisterController, LoginController } from '../controllers/index.js'
import upload from '../middleware/multer.js';
import { ForgotPassword, ResetPassword } from '../controllers/index.js';

const router = express.Router();


router.post('/register', upload, RegisterController)
router.post('/login', LoginController)
router.post('/forgot', ForgotPassword);
router.post('/reset/:token', ResetPassword)
export default router;
