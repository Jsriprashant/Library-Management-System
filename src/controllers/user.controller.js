import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { Book } from "../models/book.models.js"
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    // creating a universal funciton to generate access token and refresh token
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        // console.log("access token", accessToken)
        // console.log("refreshToken ", refreshToken)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access token and refresh token ");

    }
}

const registerUser = asyncHandler(
    async (req, res) => {
        // Get User details from the frontend
        // check if any field is empty
        // check if user already exists
        // create a user object and make a entry in DB
        // remove password and refresh token from the response
        // check for user creation
        // return response if user created sucessfully

        const { email, username, fullname, password, refreshToken } = req.body

        //destructured the data from recieved from the front end.
        // console.log(email)
        // validations
        // we can use if else for this 
        // if(username===""){
        //     throw new apiError(400,"Full name is required")

        // }

        // either we can write the if statements for every field 
        // or we can use the below method

        if ([email, username, fullname, password, refreshToken].some((field) =>
            field?.trim() === ""
        )) {
            throw new apiError(400, "All fields are required")
        }

        // we can do this or
        // const existedUser = User.findOne({
        //     email
        // })

        // we want to check if the username or email is present, if yes then return error
        // ?we can se operators for it 

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new apiError(409, "User already exists")
        }

        const user = await User.create({
            fullname,
            email,
            username: username.toLowerCase(),
            password,
            refreshToken


        })

        // now to know if the user has been created or not in the DB we are going to make another call to DB

        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        // now we do not want to show the password and refresh token to the user, so either we remove it from the user.create 
        // or we can use this .select in this function we pass the fields which we want to exclude with a - symbol  

        if (!createdUser) {
            throw new apiError(500, "something went wrong while registering the user")
        }

        // now we have to send the response 
        // we will use our apiResponse so that properly structured response is sent everytime

        return res.status(201).json(
            new apiResponse(201, createdUser, "User registered Sucessfully")
        )


    })

const loginUser = asyncHandler(
    async (req, res) => {
        // steps
        // Take the Data from req.body
        // find the user (through username or email)
        // match the passwords(if user is found)
        // generate the access and refresh tokens (if the passowrds match)
        // send the access tokens through cookies(secure cookies)
        // send the acknowledgement that the user is logged in

        const { username, email, password } = req.body


        const user = await User.findOne(
            {
                $or: [{ username }, { email }]
            }
        )
        // console.log("reached here", user)
        if (!user) {
            throw new apiError(404, "User with the username or email not found");

        }

        const isMatch = await user.isPasswordCorrect(password)

        if (!isMatch) {
            throw new apiError(401, "Password entered is incorrect");

        }

        // separate method created above
        // const accessToken = await user.generateAccessToken()
        // const refreshToken = await user.generateRefreshToken()

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)


        // now the user that we queried by findone is nt updated as after that we have generated the refresh tokens and updated the user and also it has all fields like password, tokens, which should not be sent to the front end
        //so we make a mongoDb call again

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        // Creating options for cookies

        const options = {
            httpOnly: true,
            secure: true
        }

        // now in the response we are setting cookies

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
            new apiResponse(200, {
                user: loggedInUser,
                refreshToken: refreshToken,
                accessToken: accessToken
                // now why we are sending the accessToken and refrsh token in json? as we have already did it in cookies
                // its because we aer handleing the case when user wants to save the accessToken and the refresh token in local storage (maybe the user is developing a mobile application so there is no cookies  )
            }, "User logged in Sucessfully")
        )



    }
)

const logoutUser = asyncHandler(async (req, res) => {

    // console.log("username", req.user.username)
    await User.findByIdAndUpdate(
        req.user._id,
        // as from the middle ware (verifyJWT we have embeded a user object in the request)
        {

            $set: { refreshToken: null }
            // we are using the set operator to the set the refresh token as NULL

        },
        {
            new: true
            // by this, when we send the response then we will get the new and updated value not the old one
        }

    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("refreshToken", options).clearCookie("accessToken", options).json(new apiResponse(200, {}, "User logged out successfully"))

})


// Controllers for Library Management System

// Add book
const addBook = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const user = await User.findById(userId)
    if (!user) {
        throw new apiError(401, "User authentication failed or user not registered")

    }

    const { bookId, title, author, publicationYear, totalCopies, availableCopies } = req.body;

    if (!title || !author || !bookId || !publicationYear || !totalCopies || !availableCopies) {
        return res.status(400).json({ message: "All fields are required" });
    }

    await Book.create({ bookId, title, author, publicationYear, totalCopies, availableCopies });
    const createdBook = await Book.findOne({
        bookId
    })

    if (!createdBook) {
        throw new apiError(500, "Error while adding the book")
    }


    return res.status(200).json(new apiResponse(200, { createdBook }, "Book added sucesssfully"))


})


export { registerUser, loginUser, logoutUser, addBook }