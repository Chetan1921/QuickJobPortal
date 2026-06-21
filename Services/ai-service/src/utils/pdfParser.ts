const pdfParse = require('pdf-parse');

export const parsePDF = async (fileBuffer: Buffer): Promise<string> => {
    try {
        const data = await pdfParse(fileBuffer);
        return data.text;
    } catch (error: any) {
        console.error("PDF Parse Error:", error);
        throw new Error("Failed to parse PDF file");
    }
};