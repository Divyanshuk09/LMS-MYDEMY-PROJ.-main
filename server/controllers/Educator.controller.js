import { clerkClient } from '@clerk/express'
import { v2 as cloudinary } from 'cloudinary'

import Course from '../models/Course.model.js'
import Purchase from '../models/Purchase.model.js'
import User from '../models/User.model.js'

//update role of user from student to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })

        return res.json({
            success: true,
            message: 'You can publish  your course now'
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// Add new course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({
                success: false,
                message: 'Thumbnail Not Attached'
            })
        }

        let parsedCourseData;
        try {
            parsedCourseData = JSON.parse(courseData);
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid courseData format'
            });
        }
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.path);

        const newCourse = await Course.create({
            ...parsedCourseData,
            educator: educatorId,
            courseThumbnail: result.secure_url
        });

        res.status(201).json({
            success: true,
            message: 'Course added successfully',
            course: newCourse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
}

// Get educator Courses
export const educatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })

        if (!courses) {
            return res.json({
                success: false,
                message: "You don't have any courses"
            })
        }
        return res.json({
            success: true,
            courses: courses,
            message: "Courses fetched successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
}

// Get educator data for dashboard (total earning, students enrolled , no. of courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })

        const totalcourses = courses.length;

        const courseIds = courses.map(course => course._id);

        //cal total earnings from purchase
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        //collect unique enrolled student IDs with their course titles 
        const enrolledStudentsData = []

        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl')

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        return res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                totalcourses,
                enrolledStudentsData,
            },
            message: "educatorDashboard data fetched",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
}

//get enrolled students data with purchase data

export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id);


        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        return res.json({
            success: true,
            enrolledStudents,
            message: "Enrolled Students fetched!"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}