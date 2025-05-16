import * as ai from "../services/ai.service.js";

export const getResult = async (prompt) => { 
    try {
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const response = await ai.generateContent(prompt);
        return response;
    } catch (error) {
        console.error("Error in getResult:", error.message);
    }
}