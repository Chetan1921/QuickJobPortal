import { RedisClient } from "../index.js";

export class CacheService {
    private TTL = 86400;

    async set(key: string, data: any): Promise<void> {
        try {
            await RedisClient.setEx(key, this.TTL, JSON.stringify(data));
        } catch (error) {
            console.error("Redis Set Error:", error);
        }
    }

    async get(key: string): Promise<any | null> {
        try {
            const data = await RedisClient.get(key);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error("Redis Get Error:", error);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await RedisClient.del(key);
        } catch (error) {
            console.error("Redis Delete Error:", error);
        }
    }
}

export const cacheService = new CacheService();