import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/index.js';
const app = express();
dotenv.config();
import cors from 'cors';
app.use(cors());
const port = process.env.PORT || 5002;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use('/api/v1/user', userRoutes);
app.listen(port, () => {
    console.log(`User Service is Listening on port : ${port}`);
});
