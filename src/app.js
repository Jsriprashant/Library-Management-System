import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

// Middleware to handle CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Certificate: true
}))

//Middleware to parse incoming request data, and setting limit of data to 16kb
app.use(express.json({ limit: "16kb" }))

//Middleware to parse incoming request with URL data, and setting limit of data to 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//Middleware to serve static files
app.use(express.static("public"))

// Middleware to parse cookies
app.use(cookieParser())

export { app }