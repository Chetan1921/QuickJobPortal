import { openAIClient, MODEL_NAME } from "../config/azure";

export class AzureService {
    static async generateCompletion(prompt: string): Promise<string> {
        try {
            const response = await openAIClient.chat.completions.create({
                model: MODEL_NAME,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant. Always respond with valid JSON only. Do not include any markdown, code blocks, or extra text outside the JSON structure.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 2000,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error("No response from Azure OpenAI");
            }

            // Clean markdown code blocks if present
            let cleanedContent = content.trim();
            if (cleanedContent.startsWith("```json")) {
                cleanedContent = cleanedContent.replace(/```json\n?/, "").replace(/```$/, "");
            } else if (cleanedContent.startsWith("```")) {
                cleanedContent = cleanedContent.replace(/```\n?/, "").replace(/```$/, "");
            }

            return cleanedContent;
        } catch (error: any) {
            console.error("Azure OpenAI Error:", error);

            // Log more details if available
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }

            throw new Error("Failed to generate AI response");
        }
    }
}