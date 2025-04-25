# MyDemy LMS

MyDemy is a modern Learning Management System (LMS) designed to empower educators and students with a seamless online learning experience. It provides tools for creating, managing, and consuming educational content, all in one platform.

---

## ✨ Features

### 🎓 For Students
- **Course Discovery**: Browse and search for courses across various categories.
- **Interactive Learning**: Watch video lectures, track progress, and mark lectures as completed.
- **Progress Tracking**: Visualize your learning journey with detailed progress indicators.
- **Course Reviews**: Rate and review courses to help others make informed decisions.
- **Personalized Dashboard**: Access your enrolled courses and track completion status.

### 👩‍🏫 For Educators
- **Course Creation**: Create courses with chapters, lectures, and multimedia content.
- **Revenue Tracking**: Monitor earnings and student enrollments.
- **Student Insights**: View enrolled students and their progress.
- **Secure Media Uploads**: Upload course thumbnails and other assets via **Cloudinary**.
- **Role Management**: Seamlessly transition from a student to an educator.

### 🌐 Platform Features
- **Authentication**: Secure login and user management powered by **Clerk**.
- **Payments**: Integrated payment gateway using **Stripe**.
- **Responsive Design**: Optimized for all devices.
- **Dark/Light Mode**: User-friendly themes for better accessibility.
- **SEO Optimized**: Enhanced visibility for courses and platform content.

---

## 🛠️ Tech Stack

### **Frontend**
- **React**: Component-based UI library.
- **Vite**: Fast and modern build tool.
- **TailwindCSS**: Utility-first CSS framework for responsive design.

### **Backend**
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM for MongoDB.

### **Additional Tools**
- **Clerk**: Authentication and user management.
- **Stripe**: Payment gateway for handling transactions.
- **Cloudinary**: Media storage for course thumbnails.
- **Multer**: Middleware for file uploads.

---

## 📂 Folder Structure

### Client
```
client/
├── public/ # Static assets
├── src/
│ ├── assets/ # Images, icons, and dummy data
│ ├── Components/ # Reusable React components
│ ├── Context/ # React Context for global state management
│ ├── Pages/ # Page components for routing
│ ├── App.jsx # Main application component
│ ├── main.jsx # Entry point for the React app
│ ├── index.css # Global styles
├── .env # Environment variables
├── package.json # Project metadata and dependencies
├── vite.config.js # Vite configuration
```

### Server

```
server/
├── controllers/ # API logic for users, courses, etc.
├── models/ # Mongoose schemas for MongoDB
├── routes/ # API route definitions
├── middlewares/ # Custom middleware (auth, file uploads)
├── configs/ # Configuration files
│ ├── database.js # Database configuration
│ ├── cloudinary.js # Cloudinary setup
├── server.js # Entry point for the backend
├── .env # Environment variables
├── package.json # Project metadata and dependencies
```


---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+
- **MongoDB** (local or cloud instance)
- **Clerk**, **Stripe**, and **Cloudinary** accounts

### Installation

#### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   cd LMS-MYDEMY-PROJ.-main/server
    ```

2. Install dependencies:
```npm install```
3. Configure environment variables in .env:
    ```PORT=5000
    MONGO_URI=your_mongodb_connection_string
    STRIPE_SECRET_KEY=your_stripe_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLERK_API_KEY=your_clerk_api_key
    ```
4. Start the server:
    ```npm start```
The backend will run on http://localhost:5000.


#### Frontend

1. Navigate to the client folder:
    
    ```cd ../client```
    
2. Install dependencies:
    
    ```npm install```
    
3. Configure environment variables in .env:
    
    ```VITE_BACKEND_URL=http://localhost:5000
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_CURRENCY=$
    ```
    
4. Start the development server:
    
    ```npm run dev```
    
5. Access the application at http://localhost:5173.

## 📖 API Endpoints

##### User APIs

* POST /api/user/add-rating - Add a rating for a course.
* POST /api/user/update-course-progress - Update lecture completion status.
* GET /api/user/get-course-progress - Retrieve progress for a specific 
course.

##### Educator APIs

* POST /api/educator/add-course - Create a new course.
* GET /api/educator/my-courses - Fetch all courses created by the educator.
* GET /api/educator/dashboard - Retrieve educator dashboard data.
* GET /api/educator/enrolled-students - Fetch enrolled students' data.

##### Course APIs

* GET /api/course/all - Fetch all available courses.
* GET /api/course/details/:id - Fetch details of a specific course.

## 🛠️ Future Enhancements

Quizzes and Assignments: Add interactive quizzes and assignments.
Notifications: Implement a notification system for course updates.
Analytics: Provide detailed analytics for educators to track student performance.

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.