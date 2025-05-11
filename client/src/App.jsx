import React from "react";
import "./App.css";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./Pages/Student/Home";
import CourseList from "./Pages/Student/CourseList";
import CourseDetails from "./Pages/Student/CourseDetails";
import MyEnrollments from "./Pages/Student/MyEnrollments";
import Player from "./Pages/Student/Player";
import Loading from "./Components/Student/Loading";
import Educator from "./Pages/Educator/Educator";
import Dashboard from "./Pages/Educator/Dashboard";
import MyCourses from "./Pages/Educator/MyCourses";
import StudentEnrolled from "./Pages/Educator/StudentEnrolled";
import Navbar from "./Components/Student/Navbar";
import Hero from "./Components/Student/Hero";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./Context/ThemeContext";
import PrevAddCourse from "./Pages/Educator/AddCourse";

// App.js
const App = () => {
  const isEducatorRoute = useMatch("/educator/*");
  const { isDark } = useTheme();
  return (
    <div
      className={`text-default min-h-screen ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}>
      <ToastContainer theme={isDark ? "dark" : "light"} autoClose="2000" />

      {!isEducatorRoute && <Navbar />}
      <Routes>
        {/* Student routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Educator routes */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<PrevAddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};
export default App;
