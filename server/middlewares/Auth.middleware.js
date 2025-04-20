import { clerkClient } from "@clerk/express";

//middleware to protect educator routes

export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        console.log("userId",userId);
        
        const response = await clerkClient.users.getUser(userId)

        if (response.publicMetadata.role !== 'educator') {
            return res.json({
                success: false,
                message: " Unauthorized Access, Only educator can upload !"
            })
        }
        next()
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}