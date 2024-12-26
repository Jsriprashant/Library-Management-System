import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        // this is the schema for the user model
        // it has the following fields

        //we are not make any field for userId, as mongoose automatically creates a field called _id which will be a unique indentifier for the user.
        username: {
            type: String,
            required: true,
            trim: true,
            //trim removes whitesapces from the string
            unique: true,
            index: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        borrowedBooks: [
            {
                // this is a array of objects. it is used to store the books borrowed by the user

                bookId: {
                    // this is the id of the book, we get this by referencing the book model
                    type: String,
                    ref: "Book", // Reference to the Book model
                    required: true,
                },
                borrowDate: {
                    type: Date,
                    default: Date.now, // Automatically set to the current date
                },
            },
        ],
    },
    { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    // pre is a middleware function which is called before saving the user
    // before saving the user we are hashing the password
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
    // using bcrypt's compare function to compare the password entered by the user and the password stored in the database
};

// JWT Access Token generation
userSchema.methods.generateAccessToken = function () {
    // this method is used to generate the access token using jwt
    // acess token is made using the user's id, username, fullname and email
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullname: this.fullname,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// JWT Refresh Token generation
userSchema.methods.generateRefreshToken = function () {
    // this method is used to generate the refresh token using jwt
    // refresh token is made using the user's id
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
