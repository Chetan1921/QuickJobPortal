import app from './app.js';
import dotenv from 'dotenv';
import { ConnectDB } from './utils/db.js';
import { ErrorMiddleware } from './middleware/ErrorMiddleware.js';
import { createClient } from 'redis';
import dns from 'node:dns';
// Force Node to prefer IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');
dotenv.config();
const PORT = process.env.PORT || 5001;
// connect With Redis Client
const redisurl = process.env.REDIS_URL;
export const RedisClient = createClient({
    url: redisurl
});
RedisClient.connect().then(() => {
    console.log("Redis Connected Successfully");
}).catch(console.error);
// Connect With Database
ConnectDB();
// ProducerInit();
app.use(ErrorMiddleware);
app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
});
