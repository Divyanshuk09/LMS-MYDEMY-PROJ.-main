import User from "../models/User.model.js";
import { Webhook } from "svix";

// API controller function to manage Clerk user with database
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageURL: data.image_url
                };

                await User.create(userData);
                return res.json({ success: true });
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageURL: data.image_url
                };

                await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true });
                break;   
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
                break;   
            }
            default:
                return res.status(200).json({ message: "Event not handled" });
        }
    } catch (error) {
        console.log("Webhook Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
