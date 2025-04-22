import { Router } from 'express'
import { getUserCourseProgress, getUserData, PurchaseCourse, UpdateUserCourseProgress, userEnrolledCourses, usercourseRating } from '../controllers/User.controller.js'
const Route = Router()

Route.get('/user-data', getUserData)
Route.get('/user-enrolled-courses', userEnrolledCourses)
Route.post('/purchase', PurchaseCourse)
Route.post('/update-course-progress', UpdateUserCourseProgress)
Route.get('/get-course-progress', getUserCourseProgress)
Route.post('/add-rating', usercourseRating)

export default Route;