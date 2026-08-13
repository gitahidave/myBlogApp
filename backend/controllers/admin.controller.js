import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



//Controller to Login User
export const loginAdmin = async(req, res)=>{
    try
    {
        const { userEmail, userPassword } = req.body;

        //form validation
        if(!userEmail || !userPassword)
        {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required!"
            });
        }

        //Check if user exists
        const existingUser = await User.findOne({userEmail}).select("+userPassword");
        if(!existingUser)
        {
            return res.status(409).json({
                success: false,
                message: "Invalid Credentials!"
            }); 
        }

        //compare passwords
        const isMatch = await bcryptjs.compare(userPassword, existingUser.userPassword);
        if(!isMatch)
        {
            return res.status(409).json({
                success: false,
                message: "Invalid Credentials!"
            });
        }

        //check user roles
        if(existingUser.userRole !== "admin")
        {
            return res.status(403).json({
                success: false,
                message: "Unauthorize Access!"
            });
        }



        //set token
        const token = jwt.sign(
            {
                id: existingUser._id,
                userRole: existingUser.userRole
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d"
            }
        );

        //set cookie
        res.cookie("myBlogCookie", token, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None",
            path: "/"
        });

        //login the user
        res.status(201).json({
            success: true,
            message: "Welcome Back",
            token
        });

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went wrong While Loggin In!"
        });
    }
}
