import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"


// creating this middleware so that we can verify the JWT token, for the user, and by this we can authenticate the user without the need of sending the username and password again and again
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "")
        // now if the access token is not found in cookies(maybe a mobile application) then we look at the header for the keyword "Authorization"
        // and while sending the authorization header the value it should contain according to documentation is 
        // authorixation : Bearer <accessToken>, we dont need bearer word, so we replace it with empty string.

        if (!token) {
            throw new apiError(401, "Unauthorized Request")
        }

        // now the we need to verify the JWT token
        // access token has the user information in encoded form (as we have created the access token using id,username,email etc(in teh generate accessToken function))
        // so we use jwt.verify to verify teh token and on verificaiton it returns the decoded information

        const decoded_user_data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded_user_data?._id).select("-password -refreshToken")

        if (!user) {
            throw new apiError(401, "Invalid access Token");

        }
        console.log("middleware", user)

        // now we have verified the user, and we need to add this user to the request object
        req.user = user // add a new user object and asigning it with user data
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access token")
    }

})

