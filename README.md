# Library Management System

## Summary
The **Library Management System** is a backend application built with Node.js, Express.js, and MongoDB. It provides functionalities to manage users and books, including features such as user registration, login, logout, adding books, borrowing books, returning books, and viewing available books.

This application uses JWT for authentication, bcrypt for password hashing, and follows modular design principles to ensure scalability and maintainability.


---

## Features
- **User Authentication:**
  - Register users with email, username, full name, and password.
  - Login and generate secure access and refresh tokens.
  - Logout users by clearing tokens.

- **Library Management:**
  - Add books with details like title, author, publication year, total copies, and available copies.
  - Borrow books 
  - Return books and update availability.
  - View all available books in the library.

---

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [npm](https://www.npmjs.com/)

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Jsriprashant/Library-Management-System
    cd Library-Management-System

   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up MongoDB:**
   - Install MongoDB from the [official website](https://www.mongodb.com/try/download/community) or use a cloud-based MongoDB instance (e.g., MongoDB Atlas).
   - Update the `MONGODB_URI` in the `.env` file with your MongoDB connection string.

4. **Configure Environment Variables:**
   - Create a `.env` file in the root directory and add the following:
     ```env
     PORT=3000
     MONGODB_URI=<your-mongodb-uri>
     CORS_ORIGIN=*

     ACCESS_TOKEN_SECRET=<your-access-token-secret> or <any-text>
     ACCESS_TOKEN_EXPIRY=1d

     REFRESH_TOKEN_SECRET=<your-refresh-token-secret> or <any-text>
     REFRESH_TOKEN_EXPIRY=10d
     ```

5. **Run the Application:**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`.

---

## API Endpoints
### User Authentication
1. **Register User**  
   `POST /api/v1/users/register`
   
   - Request Body:
     ```json
     {
       "email": "user@example.com",
       "username": "user123",
       "fullname": "John Doe",
       "password": "password123"
     }
     ```

2. **Login User**  
   `POST /api/v1/users/login`
   
   - Request Body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```

3. **Logout User**  
   `POST /api/v1/users/logout` (Requires authentication)

### Library Management
1. **Add Book**  
   `POST /api/v1/users/addBook` (Requires authentication)

   - Request Body:
     ```json
     {
       "bookId": "12345",
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "publicationYear": 1925,
       "totalCopies": 5,
       "availableCopies": 5
     }
     ```

2. **Borrow Book**  
   `POST /api/v1/users/borrowBook/:bookId` (Requires authentication)

3. **Return Book**  
   `POST /api/v1/users/returnBook/:bookId` (Requires authentication)

4. **View Available Books**  
   `GET /api/v1/users/viewAvailableBooks`

---

## Running Tests
1. **Install Testing Frameworks:**
   ```bash
   npm install --save-dev jest supertest
   ```

2. **Create Test Files:**
   - Place test files in the `tests` folder.
   - Example: `tests/user.test.js`.

3. **Run Tests:**
   ```bash
   npm test
   ```

---

---

## Tools and Technologies
- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JWT and bcrypt
- **Testing:** Jest and Supertest

---

## Notes
- Ensure you do not commit your `.env` file to version control.
- Use secure random strings for your `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

---




