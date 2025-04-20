import { Router } from "express";
import { getAllCourses, getcoursebyId } from "../controllers/Course.controller.js";
const Route = Router()

Route.get('/all-courses',getAllCourses)
Route.get('/:id',getcoursebyId)

export default Route