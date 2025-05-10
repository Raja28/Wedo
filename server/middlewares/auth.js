const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }
        try {
            const tokenData = jwt.verify(token, process.env.JWT_SECRET);
            req.user = tokenData
            next()
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            })
        }
    } catch (error) {
        console.log("Auth middleware error:", error); 
        return res.status(500).json({
            success: false,
            message: "Error validating token"
        })
    }
}