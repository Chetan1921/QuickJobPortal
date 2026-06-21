import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { AzureService } from "../services/azureService.js";
import { cacheService } from "../utils/cache.js";
import { CAREER_GUIDANCE_PROMPT } from "../utils/template.js";
import TryCatch from "../middleware/TryCatch.js";

export const getCareerGuidance = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const skills = user.skills || [];
    if (skills.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please add skills to your profile first",
        });
    }

    const cacheKey = `career:${user.id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            data: cached,
            cached: true,
        });
    }

    const prompt = CAREER_GUIDANCE_PROMPT(skills);
    const response = await AzureService.generateCompletion(prompt);

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(response);
    } catch (parseError) {
        console.error("JSON Parse Error:", response);
        return res.status(500).json({
            success: false,
            message: "Failed to parse AI response",
        });
    }

    await cacheService.set(cacheKey, parsedResponse);

    res.json({
        success: true,
        data: parsedResponse,
        cached: false,
    });
});