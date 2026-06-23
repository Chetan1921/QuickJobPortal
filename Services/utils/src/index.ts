import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";
// import { InitConsumer } from './kafka/consumer.js';



dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
// InitConsumer();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use('/api/v1/utils', routes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Utils Service is running on port ${PORT}`);
})
