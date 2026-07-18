import express from 'express'
import authRoutes from './routes/index.js'
const app = express()
import cors from 'cors'



app.use(
   cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (
                origin === "http://localhost:5173" ||
                origin.endsWith(".vercel.app")
            ) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use('/api/v1/auth', authRoutes)

export default app;
