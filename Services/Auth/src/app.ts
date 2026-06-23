import express from 'express'
import authRoutes from './routes/index.js'
const app = express()
import cors from 'cors'


app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://quick-job-portal.vercel.app'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use('/api/v1/auth', authRoutes)

export default app;