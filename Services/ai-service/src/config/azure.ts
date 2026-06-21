import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.AZURE_OPENAI_API_KEY) {
    throw new Error("Missing AZURE_OPENAI_API_KEY in environment variables");
}

if (!process.env.AZURE_OPENAI_API_BASE_PATH) {
    throw new Error("Missing AZURE_OPENAI_API_BASE_PATH in environment variables");
}

if (!process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME) {
    throw new Error("Missing AZURE_OPENAI_API_DEPLOYMENT_NAME in environment variables");
}

if (!process.env.AZURE_OPENAI_API_VERSION) {
    throw new Error("Missing AZURE_OPENAI_API_VERSION in environment variables");
}

export const openAIClient = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_API_BASE_PATH}/openai/deployments/${process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME}`,
    defaultQuery: {
        "api-version": process.env.AZURE_OPENAI_API_VERSION,
    },
    defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_API_KEY,
    },
});

export const MODEL_NAME = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;