import { registerUser, loginUser, logoutUser, addBook, borrowBook } from "../controllers/user.controller.js"
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// Routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// Secured Routes
// we run this verify jwt middle ware that takes incoming request and verifies the user through cookies and in the request add a object with the decoded user detail and pass it to the next 
router.route("/logout").post(verifyJWT, logoutUser)

// Routes for library management system
// Addbook route
router.route("/addBook").post(verifyJWT, addBook)

// borrow book route
router.route("/borrowBook/:bookId").post(verifyJWT, borrowBook)





export default router