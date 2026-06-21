import app from "./app.js";
import { createClient } from "redis";

const redisurl = process.env.REDIS_URL || "redis://localhost:6379";
export const RedisClient = createClient({
    url: redisurl,
});

RedisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

RedisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

(async () => {
    await RedisClient.connect();
})();

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => {
    console.log(`🚀 AI Service running on port ${PORT}`);
});

process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await RedisClient.quit();
    process.exit(0);
});