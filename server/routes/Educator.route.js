import { Router } from "express";
import { addCourse, educatorCourses, educatorDashboardData, getEnrolledStudentsData, updateRoleToEducator } from "../controllers/Educator.controller.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/Auth.middleware.js";

const Route = Router()

Route.get('/update-role', updateRoleToEducator)
Route.post('/add-course', upload.single('image'), protectEducator, addCourse)
Route.get('/my-courses', protectEducator, educatorCourses)
Route.get('/dashboard', protectEducator, educatorDashboardData)
Route.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

export default Route