import {Router} from 'express'
import { getUserData, PurchaseCourse, userEnrolledCourses } from '../controllers/User.controller.js'
const Route = Router()

Route.get('/user-data',getUserData)
Route.get('/user-enrolled-courses',userEnrolledCourses)
Route.post('/purchase',PurchaseCourse)

export default Route;