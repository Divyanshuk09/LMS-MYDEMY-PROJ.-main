import mongoose, { Schema } from "mongoose";

const courseProgressSchema = new Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: { type: [String], default: [] }
}, { timestamps: true });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress;