import Stripe from 'stripe';
import User from "../models/User.model.js";
import Course from '../models/Course.model.js'
import Purchase from "../models/Purchase.model.js";

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