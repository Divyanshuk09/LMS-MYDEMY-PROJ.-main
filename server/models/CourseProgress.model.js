import mongoose, { Schema } from "mongoose";

const courseprogressSchema = new Schema({
    userId:{type:String,required:true},
    courseId:{type:String,required:true},
    completed:{type:Boolean,default:false},
    lectureCompleted:[]
},{timestamps:true})

const CourseProgress = mongoose.model('CourseProgress',courseprogressSchema)

export default CourseProgress;