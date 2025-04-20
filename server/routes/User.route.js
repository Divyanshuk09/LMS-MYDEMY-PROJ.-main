import {Router} from 'express'
import { getUserData, userEnrolledCourses } from '../controllers/User.controller.js'
const Route = Router()

Route.get('/user-data',getUserData)
Route.get('/user-enrolled-courses',userEnrolledCourses)

export default Route;