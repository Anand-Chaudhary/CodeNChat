import * as ai from '../services/ai.service.js';


export const getResult = async (req, res) => {
    try {
        const { prompt }  = req.query;
        const result = await ai.generateContent(prompt);
        res.send(result);
    } catch (error) {
        console.log("Error in getResult:" ,error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
}