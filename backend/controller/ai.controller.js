import * as ai from "../services/ai.service.js";

export const getResult = async (req, res) => { 
    try {
        const { prompt } = req.query;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const response = await ai.generateContent(prompt);
        res.send(response);
    } catch (error) {
        console.error("Error in getResult:", error.message);
        res.status(500).json({ error: error.message });   
    }
}