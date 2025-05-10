import Stripe from "stripe";
import User from "../models/User.model.js";
import { Webhook } from "svix";
import Purchase from "../models/Purchase.model.js";
import Course from "../models/Course.model.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify the webhook
        await whook.verify(
            JSON.stringify(req.body),
            {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            }
        );

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                if (!data.id) throw new Error("User ID is required");

                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "no-email@example.com",
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || "Anonymous",
                    imageUrl: data.image_url || ""
                };

                await User.create(userData);
                return res.json({ success: true });
            }

            case "user.updated": {
                if (!data.id) throw new Error("User ID is required");

                const userData = {
                    email: data.email_addresses?.[0]?.email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    imageUrl: data.image_url
                };

                await User.findByIdAndUpdate(data.id, userData, { new: true });
                return res.json({ success: true });
            }

            case "user.deleted": {
                if (!data.id) throw new Error("User ID is required");
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
            }

            default:
                return res.status(200).json({ message: "Event not handled" });
        }
    } catch (error) {
        console.error("Webhook error:", error);

        // Differentiate between verification errors and other errors
        if (error instanceof WebhookVerificationError) {
            return res.status(401).json({
                success: false,
                message: "Invalid signature"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Initialize Stripe with correct variable name
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body, // This now correctly receives raw body
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return response.status(400).json({ 
            success: false,
            error: `Webhook Error: ${err.message}` 
        });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleSessionCompleted(event.data.object);
                break;
            case 'checkout.session.async_payment_failed':
                await handleSessionFailed(event.data.object);
                break;
            case 'charge.failed':
                await handleChargeFailed(event.data.object);
                break;
            default:
                console.log(`⚠️ Unhandled event type: ${event.type}`);
        }
        return response.json({ success: true });
    } catch (error) {
        console.error('🔥 Webhook Processing Error:', error);
        return response.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Enhanced Helper Functions
async function handleSessionCompleted(session) {
    try {
        if (!session?.metadata?.purchaseId) {
            throw new Error('Missing purchaseId in session metadata');
        }

        const purchase = await Purchase.findById(session.metadata.purchaseId);
        if (!purchase) {
            throw new Error(`Purchase not found: ${session.metadata.purchaseId}`);
        }

        if (session.payment_status === 'paid') {
            // Transaction to ensure data consistency
            const session = await Purchase.startSession();
            await session.withTransaction(async () => {
                purchase.status = 'completed';
                await purchase.save({ session });

                await Promise.all([
                    User.findByIdAndUpdate(
                        purchase.userId,
                        { $addToSet: { enrolledCourses: purchase.courseId } },
                        { session }
                    ),
                    Course.findByIdAndUpdate(
                        purchase.courseId,
                        { $addToSet: { enrolledStudents: purchase.userId } },
                        { session }
                    )
                ]);
            });

            console.log(`✅ Successfully processed purchase ${purchase._id}`);
        } else {
            purchase.status = 'failed';
            await purchase.save();
            console.warn(`⚠️ Payment failed for purchase ${purchase._id}`);
        }
    } catch (error) {
        console.error('💥 Session Completion Error:', error);
        throw error; // Re-throw to trigger webhook error response
    }
}

async function handleSessionFailed(session) {
    try {
        if (!session?.metadata?.purchaseId) {
            throw new Error('Missing purchaseId in session metadata');
        }

        const purchase = await Purchase.findByIdAndUpdate(
            session.metadata.purchaseId,
            { status: 'failed' },
            { new: true }
        );

        if (!purchase) {
            throw new Error(`Purchase not found: ${session.metadata.purchaseId}`);
        }

        console.log(`⚠️ Marked purchase ${purchase._id} as failed`);
    } catch (error) {
        console.error('💥 Session Failure Error:', error);
        throw error;
    }
}

async function handleChargeFailed(charge) {
    try {
        if (!charge.payment_intent) {
            throw new Error('Missing payment_intent in charge');
        }

        const sessions = await stripeInstance.checkout.sessions.list({
            payment_intent: charge.payment_intent
        });

        if (sessions.data.length > 0 && sessions.data[0].metadata?.purchaseId) {
            await Purchase.findByIdAndUpdate(
                sessions.data[0].metadata.purchaseId,
                { status: 'failed' }
            );
            console.log(`⚠️ Marked purchase as failed for charge ${charge.id}`);
        }
    } catch (error) {
        console.error('💥 Charge Failure Error:', error);
        throw error;
    }
}

