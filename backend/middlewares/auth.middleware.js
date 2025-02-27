import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.headers.authorization.split(' ')[1] 
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
