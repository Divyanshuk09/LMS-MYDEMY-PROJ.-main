# MyDemy Backend

This is the backend service for the **MyDemy Learning Management System (LMS)**. It provides APIs for managing courses, users, enrollments, and progress tracking. The backend is built using **Node.js**, **Express**, and **MongoDB**.

---

## Features

### 1. **User Management**

- Authentication and authorization using **Clerk**.
- Role-based access control for **students** and **educators**.

### 2. **Course Management**

- Educators can:
  - Create, update, and delete courses.
  - Add chapters and lectures to courses.
  - Upload course thumbnails using **Cloudinary**.
- Students can:
  - View available courses.
  - Enroll in courses and track their progress.

### 3. **Progress Tracking**

- Tracks lecture completion for students.
- Calculates overall course progress dynamically.

### 4. **Payment Integration**

- Integrated **Stripe** for secure course purchases.
- Webhooks to handle payment events.

### 5. **File Uploads**

- Used **Multer** for handling file uploads.
- Stored media files on **Cloudinary**.

---

## API Endpoints

### **User APIs**

- `POST /api/user/add-rating`  
  Allows students to rate courses.
- `POST /api/user/update-course-progress`  
  Updates lecture completion status.
- `GET /api/user/get-course-progress`  
  Fetches progress for a specific course.

### **Educator APIs**

- `POST /api/educator/add-course`  
  Allows educators to create new courses.
- `GET /api/educator/my-courses`  
  Fetches all courses created by the educator.

### **Course APIs**

- `GET /api/course/all`  
  Fetches all available courses.
- `GET /api/course/details/:id`  
  Fetches details of a specific course.

---

## Technologies Used

### **Core Stack**

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB.

### **Additional Tools**

- **Clerk**: Authentication and user management.
- **Stripe**: Payment gateway for handling transactions.
- **Cloudinary**: Media storage for course thumbnails.
- **Multer**: Middleware for handling file uploads.

---

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Stripe and Cloudinary accounts for integration

### Steps to Run the Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   cd LMS-MYDEMY-PROJ.-main/server
   ```
2. Install dependencies:

   ```
   npm install
   ```

3. Create a .env file in the server folder and add the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLERK_API_KEY=your_clerk_api_key
   ```
4. Start the server"

   ```
   npm start
   ```
5. The backend will run on http://localhost:5000.

    ```Folder Structure
    server/
    ├── controllers/       # API logic for users, courses, etc.
    ├── models/            # Mongoose schemas for MongoDB
    ├── routes/            # API route definitions
    ├── middlewares/       # Custom middleware (e.g., auth, file uploads)
    ├── utils/             # Utility functions (e.g., error handling)
    ├── config/            # Configuration files (e.g., database, cloudinary)
    ├── .env               # Environment variables
    └── server.js          # Entry point for the backend
    ```

6. Future Enhancements:
    * Add support for quizzes and assignments.
    * Implement a notification system for course updates.
    * Add analytics for educators to track student performance.

7. Acknowledgments:

This backend was developed as part of the MyDemy LMS project. Special thanks to the open-source libraries and tools that made this possible.