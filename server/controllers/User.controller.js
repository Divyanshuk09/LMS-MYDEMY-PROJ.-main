import User from "../models/User.model.js";
import Course from '../models/Course.model.js'

//get the userData from the db
export const getUserData = async (req,res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.json({
                success:false,
                message:"User Not found"
            })            
        }
        return res.json({
            success:true,
            user
        })

    } catch (error) {
        return res.json({
                success:false,
                message:"User Not found"
            }) 
    }
}

//users enrolled courses with lecture links
export const userEnrolledCourses = async (req,res) => {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        return res.json({
            success:true,
            enrolledCourses: userData.enrolledCourses
        })
    } catch (error) { 
        return res.json({
            success:false,
            message:error.message
        })
    }
}