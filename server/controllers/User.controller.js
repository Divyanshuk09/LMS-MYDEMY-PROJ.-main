import Stripe from 'stripe';
import User from "../models/User.model.js";
import Course from '../models/Course.model.js'
import Purchase from "../models/Purchase.model.js";
import CourseProgress from '../models/CourseProgress.model.js';
import { response } from 'express';

//get the userData from the db
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId).select('-password -__v'); // Excluding sensitive/uneeded fields
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Error in getUserData:", error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
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
        const origin = req.headers.origin
        const userId = req.auth.userId

        if (!courseId) {
            return res.status(400).json({success:false,message:'Course Id is required'})
        }
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
            userId:userData._id,
            amount: Number((courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2))
        }

        const newPurchase = await Purchase.create(purchaseData)

        //stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

          // Create Stripe session
          const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: process.env.CURRENCY.toLowerCase(),
                    product_data: {
                        name: courseData.courseTitle,
                        images: [courseData.courseThumbnail],
                    },
                    unit_amount: Math.round(purchaseData.amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

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

// Update user course progress
export const UpdateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId } = req.body;

        // Basic validation
        if (!courseId || !lectureId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID and Lecture ID are required'
            });
        }

        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            // Check if lecture already completed
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.status(200).json({
                    success: true,
                    message: 'Lecture already completed'
                });
            }
            
            // Add lecture to completed array
            progressData.lectureCompleted.push(lectureId);
            
            
            await progressData.save();
        } else {
            // Create new progress entry
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            courseId, 
            lectureId
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get progress details
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId.trim();
const courseId = req.body.courseId.trim();


        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        const progressData = await CourseProgress.findOne({ userId, courseId });

        return res.status(200).json({
            success: true,
            progressData: progressData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
//add user rating to course
export const usercourseRating = async (req, res) => {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    console.log("Received request to rate course");
    console.log("userId:", userId);
    console.log("courseId:", courseId);
    console.log("rating:", rating);

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        console.log("Invalid input detected");
        return res.json({
            success: false,
            message: 'Invalid Details'
        });
    }

    try {
        const course = await Course.findById(courseId);
        console.log("Fetched course:", course);

        if (!course) {
            console.log("Course not found");
            return res.json({
                success: false,
                message: 'Course not found'
            });
        }

        const user = await User.findById(userId);
        console.log("Fetched user:", user);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            console.log("User has not purchased this course");
            return res.json({
                success: false,
                message: "User has not purchased this course"
            });
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);
        console.log("Existing rating index:", existingRatingIndex);

        if (existingRatingIndex > -1) {
            console.log("Updating existing rating");
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            console.log("Adding new rating");
            course.courseRatings.push({ userId, rating });
        }

        await course.save();
        console.log("Rating saved successfully");

        return res.json({
            success: true,
            course,
            message: "Your rating has been saved"
        });
    } catch (error) {
        console.log("Error while saving rating:", error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};
