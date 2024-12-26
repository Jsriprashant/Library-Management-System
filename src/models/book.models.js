import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        // this is the schema for the book model
        // teh book model has the following fields
        bookId: {
            type: String,
            required: true,
            unique: true, // For ISBN or custom identifier
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        publicationYear: {
            type: Number,
            required: true,
        },
        totalCopies: {
            type: Number,
            required: true,
            min: 1, // Ensures at least 1 copy exists
        },
        availableCopies: {
            type: Number,
            default: 0,
            min: 0, // Cannot be negative
        },
        borrowedBy: [
            // this is a array of objects. it is used to store the users who have borrowed the book
            {
                userId: {
                    // this is the id of the user, we get this by referencing the user model
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User", // Reference to User model
                },
                borrowDate: {
                    type: Date,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
