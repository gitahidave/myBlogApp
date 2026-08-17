import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = {
    verifyToken: async (req, res, next) => {
        try {
            const token = req.cookies?.myBlogCookie;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "No token found, user not logged in!"
                });
            }

            // Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user and explicitly exclude the password hash
            const user = await User.findById(decoded.id).select("-userPassword");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!"
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token!"
            });
        }
    },

    // Allows flexible role checking (accepts a single role string or multiple roles)
    authorizeRole: (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user || !allowedRoles.includes(req.user.userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden: Unauthorized role!"
                });
            }
            next();
        };
    }
};

export default authMiddleware;