import Course from "../models/Course.model.js";

//get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course
            .find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator' })
        return res.json({
            success: true,
            courses,
            message: "courses fetched !"
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

//get course by id
export const getcoursebyId = async (req, res) => {

    const { id } = req.params

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' })

        //remove lecture url if ispreviewFree is false

        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = " ";
                }
            })
        })

        return res.json({
            success: true,
            courseData,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}