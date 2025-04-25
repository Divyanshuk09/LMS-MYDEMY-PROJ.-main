# MyDemy LMS - Client


The frontend for MyDemy, a modern Learning Management System built with React, Vite, and TailwindCSS. This client application provides an intuitive interface for students and educators to manage courses, track progress, and facilitate online learning.

## ✨ Key Features

### 🎓 For Students
- Browse and enroll in courses with seamless payment integration
- Track learning progress with visual indicators
- Interactive video lectures with playback controls
- Course rating and review system
- Personalized dashboard with recommended courses

### 👩‍🏫 For Educators
- Comprehensive course management system
- Lecture and chapter organization tools
- Student enrollment analytics
- Revenue tracking and payout overview
- Course performance metrics

### 🌐 Platform Features
- Responsive design for all devices
- Secure authentication with Clerk
- Stripe integration for payments
- Dark/Light mode support
- Accessibility optimized UI

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- [Clerk](https://clerk.dev/) account
- [Backend server](https://github.com/your-repo/server) running

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/mydemy-client.git
   cd mydemy-client
   ```

2. Install Dependencies:
    
    ```npm install```

3. Set Up Environment Variables: Create a .env file in the client folder and add the following variables:

    ```
    VITE_BACKEND_URL=http://localhost:5000
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_CURRENCY=$
    ```

4. Run the Development Server:

    ```npm run dev```

5. Access the Application: Open your browser and navigate to http://localhost:5173.


### Folder Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, icons, and dummy data
│   ├── Components/         # Reusable React components
│   │   ├── Educator/       # Educator-specific components
│   │   ├── Student/        # Student-specific components
│   ├── Context/            # React Context for global state management
│   ├── Pages/              # Page components for routing
│   │   ├── Educator/       # Educator-specific pages
│   │   ├── Student/        # Student-specific pages
│   ├── App.jsx             # Main application component
│   ├──             # Entry point for the React app
│   ├──              # Global styles
├── .env                    # Environment variables
├── .gitignore              # Files to ignore in Git
├── package.json            # Project metadata and dependencies
├── README.md               # Documentation
```

#### How to Use This Project
1. Customize the Frontend:

* Modify the components in the src/Components folder to fit your design.
* Update the pages in the src/Pages folder to add or remove features.
2. Connect to Your Backend:
* Update the VITE_BACKEND_URL in the .env file to point to your backend server.
3. Deploy the Application:

* Use platforms like Vercel, Netlify, or AWS to deploy the frontend.

### Contributing
Feel free to fork this repository and submit pull requests. Contributions are welcome!

### License
This project is licensed under the MIT License. See the LICENSE file for details.