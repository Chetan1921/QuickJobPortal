import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { AzureService } from "../services/azureService";
import { RESUME_ANALYSIS_PROMPT } from "../utils/template";
import { parsePDF } from "../utils/pdfParser";
import TryCatch from "../middleware/TryCatch";
import upload from "../middleware/multer.js";

export const analyzeResume = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    upload(req, res, async (err: any) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed",
            });
        }

        try {
            const file = (req as any).file;
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "Resume file is required",
                });
            }

            console.log("📄 File received:", {
                name: file.originalname,
                size: file.size,
                type: file.mimetype
            });

            // Check file size
            if (file.size === 0) {
                return res.status(400).json({
                    success: false,
                    message: "File is empty",
                });
            }

            // Check if it's a PDF
            if (file.mimetype !== 'application/pdf') {
                return res.status(400).json({
                    success: false,
                    message: "Only PDF files are allowed",
                });
            }

            // Extract text from PDF
            let resumeText: string;
            try {
                resumeText = await parsePDF(file.buffer);
                console.log("✅ Text extracted successfully, length:", resumeText.length);
            } catch (parseError: any) {
                console.error("PDF Parse Error:", parseError);
                return res.status(400).json({
                    success: false,
                    message: `Failed to parse resume: ${parseError.message || 'Invalid PDF format'}`,
                });
            }

            if (!resumeText || resumeText.trim().length < 10) {
                console.log("⚠️ Extracted text too short:", resumeText?.length || 0);
                return res.status(400).json({
                    success: false,
                    message: "Could not extract text from resume. Please ensure it's not empty or corrupted.",
                });
            }

            // Generate analysis
            console.log("🤖 Sending to Azure OpenAI...");
            const prompt = RESUME_ANALYSIS_PROMPT(resumeText);
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

            res.json({
                success: true,
                data: parsedResponse,
            });
        } catch (error: any) {
            console.error("Resume Analysis Error:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Failed to analyze resume",
            });
        }
    });
});