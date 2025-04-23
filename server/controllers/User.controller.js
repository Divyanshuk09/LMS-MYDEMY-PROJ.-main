import Stripe from 'stripe';
import User from "../models/User.model.js";
import Course from '../models/Course.model.js'
import Purchase from "../models/Purchase.model.js";
import CourseProgress from '../models/CourseProgress.model.js';
import { response } from 'express';

//get the userData from the db
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.json({
                success: false,
                message: "User Not found"
            })
        }
        return res.json({
            success: true,
            user
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "User Not found"
        })
    }
}

//users enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        return res.json({
            success: true,
            enrolledCourses: userData.enrolledCourses
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//PurchaseCourse
export const PurchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId

        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.json({
                success: false,
                message: 'Data Not Found'
            })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        //stripe gateway initialize
        const stripInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        //creating line items to the stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                    images: [
                        courseData.courseThumbnail.replace('small', 'large') // Example URL modification
                    ],
                    metadata: {
                        image_size: 'large' // Optional metadata
                    }
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]


        const session = await stripInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        return res.json({
            success: true,
            session_url: session.url
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//Update user course progress
export const UpdateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.user.id
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({
                    success: true,
                    message: 'Lecture already completed.'
                })
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }
        else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        return res.json({
            success: true,
            message: 'Progress updated successfully.'
            , courseId, lectureId
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        })
    }
}

//get progress details

export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId })

        return res.json({
            success: true,
            progressData
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//add user rating to course
export const usercourseRating = async (req, res) => {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({
            success: false,
            message: 'Invalid Details'
        })
    }

    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.json({
                success: false,
                message: 'Course not found'
            })
        }
        const user = await User.findById(userId)
        if (!user || user.enrolledCourses.includes(courseId)) {
            return res.json({
                success: false,
                message: "User has not purchased this course"
            })
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else {
            course.courseRatings.push({ userId, rating })
        }
        await course.save()
        return res.json({
            success: true,
            message: "Your rating has been saved"
        })
    } catch (error) {
        return res.json({
            success: false, 
            message: error.message 
        })
    }
}