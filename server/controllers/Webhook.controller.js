import Stripe from "stripe";
import User from "../models/User.model.js";
import { Webhook } from "svix";
import Purchase from "../models/Purchase.model.js";
import Course from "../models/Course.model.js";

export const clerkWebhooks = async (req, res) => {

    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const svixHeaders = {
            id: req.headers["svix-id"],
            timestamp: req.headers["svix-timestamp"],
            signature: req.headers["svix-signature"]?.split(',')[0] + '...'  // this can be reason of error
        };

        await whook.verify(
            JSON.stringify(req.body),
            {
                "svix-id": svixHeaders.id,
                "svix-timestamp": svixHeaders.timestamp,
                "svix-signature": req.headers["svix-signature"]
            }
        );

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address || "no-email@example.com",
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
            message: error.message
        })
    }
};

const stripInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id
            const session = await stripInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const {purchaseId} = session.data[0].metadata
            const purchaseData = await Purchase.findById(purchaseId)
            const userData = await User.findById(purchaseData.userId)
            const courseData = await Course.findById(purchaseData.courseId.toString())

            courseData.enrolledStudents.push(userData)
            await courseData.save()

            userData.enrolledCourses.push(courseData)
            await userData.save()
            
            purchaseData.status = 'completed'
            await purchaseData.save()
        
            break;
        }
        case 'payment_intent.payment_failed':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id

            const session = await stripInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const {purchaseId} = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId)
            purchaseData.status = 'failed'
            await purchaseData.save()
            break;
        }
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return response.json({
        success:true,
        message:"Kuch toh hua hai"
    })
}

