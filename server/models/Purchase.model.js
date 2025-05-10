import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    imageUrl :{
        type:String,
        required:true
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
})

const Purchase = mongoose.model("Purchase", purchaseSchema)

export default Purchase;