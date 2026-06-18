import express from 'express';
import authRoutes from './routes/index.js';
const app = express();
import cors from 'cors';
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use('/api/v1/auth', authRoutes);
export default app;
