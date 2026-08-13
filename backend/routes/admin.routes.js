import express from "express";
import { loginAdmin } from "../controllers/admin.controller.js";


const router = express.Router();

//login admin
router.post("/admin-login", loginAdmin);


export default router;