import User from "../models/User.model.js";
import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {

    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const svixHeaders = {
            id: req.headers["svix-id"],
            timestamp: req.headers["svix-timestamp"],
            signature: req.headers["svix-signature"],
            // ?.split(',')[0] + '...'
        };

        await whook.verify(
            JSON.stringify(req.body),
            {
                "svix-id": svixHeaders.id,
                "svix-timestamp": svixHeaders.timestamp,
                "svix-signature": req.headers["svix-signature"]
            }
        );

        // 3. Event processing
        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address,
                    //  || "no-email@example.com",
                    // name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url || ""
                };

                const createdUser = await User.create(userData);
                return res.json({ success: true });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    name: data.first_name + " " + data.last_name,
                    // name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                };

                const updatedUser = await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
            }

            default:
                return res.status(200).json({ message: "Event not handled" });
        }
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
};