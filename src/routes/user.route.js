import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js"
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// Routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// Secured Routes
// we run this verify jwt middle ware that takes incoming request and verifies the user through cookies and in the request add a object with the decoded user detail and pass it to the next 
router.route("/logout").post(verifyJWT, logoutUser)

export default router