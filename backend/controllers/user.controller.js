import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Cookie configuration helper for environment consistency
const getCookieOptions = () => ({
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/"
});

// Register a new user and log them in immediately
export const createUser = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, userRole } = req.body;

        // Form validation
        if (!userName || !userEmail || !userPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ userName }, { userEmail }] });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or Email already exists!"
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(userPassword, 10);

        // Save new user
        const ourUser = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
            userRole: userRole || "user"
        });

        await ourUser.save();

        // Sign JWT Token
        const token = jwt.sign(
            {
                id: ourUser._id,
                userRole: ourUser.userRole
            },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // Set HttpOnly Cookie
        res.cookie("myBlogCookie", token, getCookieOptions());

        return res.status(201).json({
            success: true,
            message: `User ${userName} created successfully!`,
            token,
            user: {
                id: ourUser._id,
                userName: ourUser.userName,
                userEmail: ourUser.userEmail,
                userRole: ourUser.userRole
            }
        });

    } catch (error) {
        console.error("Create User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering!"
        });
    }
};

// Login an existing user
export const loginUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Form validation
        if (!userEmail || !userPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        // Find user with password selected
        const existingUser = await User.findOne({ userEmail }).select("+userPassword");
        if (!existingUser) {
            return res.status(409).json({
                success: false,
                message: "Invalid Credentials!"
            });
        }

        // Compare password
        const isMatch = await bcryptjs.compare(userPassword, existingUser.userPassword);
        if (!isMatch) {
            return res.status(409).json({
                success: false,
                message: "Invalid Credentials!"
            });
        }

        // Role authorization check
        if (existingUser.userRole !== "user") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized Access!"
            });
        }

        // Sign JWT Token
        const token = jwt.sign(
            {
                id: existingUser._id,
                userRole: existingUser.userRole
            },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // Set HttpOnly Cookie
        res.cookie("myBlogCookie", token, getCookieOptions());

        return res.status(200).json({
            success: true,
            message: "Welcome Back!",
            token,
            user: {
                id: existingUser._id,
                userName: existingUser.userName,
                userEmail: existingUser.userEmail,
                userRole: existingUser.userRole
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in!"
        });
    }
};

// Check cookie existence AND verify JWT validity
export const checkCookie = (req, res) => {
    try {
        const token = req.cookies.myBlogCookie;
        if (!token) {
            return res.status(200).json({ message: false });
        }

        // Verify token expiry and secret signature
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: true });

    } catch (error) {
        // Returns false if token is expired or tampered with
        return res.status(200).json({ message: false });
    }
};

// Logout user and clear session cookie
export const logoutUser = (req, res) => {
    try {
        const cookieOptions = getCookieOptions();
        delete cookieOptions.maxAge; // Remove maxAge for clearCookie

        res.clearCookie("myBlogCookie", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged Out!"
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
};

// Fetch current user profile
export const userProfile = (req, res) => {
    try {
        const { user } = req;
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("User Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
};

// Update user profile avatar
export const changeAvatar = async (req, res) => {
    try {
        const { user } = req;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No Avatar Selected!"
            });
        }

        user.avatar = req.file.path;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Avatar Changed Successfully!",
            avatar: user.avatar
        });
    } catch (error) {
        console.error("Change Avatar Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
};