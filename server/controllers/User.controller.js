import User from "../models/User.model.js";
import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {
    // 1. Enhanced request logging
    console.log("\n=== CLERK WEBHOOK TRIGGERED ===");
    console.log("🔵 Method:", req.method);
    console.log("🔵 URL:", req.url);
    console.log("🔵 Headers:", Object.keys(req.headers));
    console.log("🔵 Raw Body:", JSON.stringify(req.body, null, 2));

    try {
        // 2. Webhook verification with time measurement
        console.time("🕒 Webhook Verification Time");
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Debug: Normalized header logging
        const svixHeaders = {
            id: req.headers["svix-id"],
            timestamp: req.headers["svix-timestamp"],
            signature: req.headers["svix-signature"]?.split(',')[0] + '...' // Truncate for security
        };
        console.log("🔵 Svix Headers:", svixHeaders);

        await whook.verify(
            JSON.stringify(req.body),
            {
                "svix-id": svixHeaders.id,
                "svix-timestamp": svixHeaders.timestamp,
                "svix-signature": req.headers["svix-signature"] // Use full original signature
            }
        );
        console.timeEnd("🕒 Webhook Verification Time");

        // 3. Event processing
        const { data, type } = req.body;
        console.log(`\n🟢 Processing ${type} for user: ${data.id}`);

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address || "no-email@example.com",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url || ""
                };
                console.log("🟢 User data to create:", userData);

                const createdUser = await User.create(userData);
                console.log("🟢 User created successfully:", createdUser);
                return res.json({ success: true });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0]?.email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url
                };
                console.log("🟢 User data to update:", userData);

                const updatedUser = await User.findByIdAndUpdate(data.id, userData);
                console.log("🟢 User updated successfully:", updatedUser);
                return res.json({ success: true });
            }

            case "user.deleted": {
                console.log("🟢 Deleting user:", data.id);
                await User.findByIdAndDelete(data.id);
                console.log("🟢 User deleted successfully");
                return res.json({ success: true });
            }

            default:
                console.log("🟡 Unhandled event type:", type);
                return res.status(200).json({ message: "Event not handled" });
        }
    } catch (error) {
        // 4. Detailed error logging
        console.error("🔴 ERROR DETAILS:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("Full error object:", JSON.stringify(error, null, 2));

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
};