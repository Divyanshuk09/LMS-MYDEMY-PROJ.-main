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

const stripInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            request.body,
            sig,
            endpointSecret
            );
    }
    catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
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
            console.log(`unhandled event type: ${event.type}`)
    }
    return response.json({success:true})
    } catch (error) {
        console.error('webhook error:',error)
        return response.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

//helper functions:
async function handleSessionCompleted(session) {
    try {
        const purchase = await Purchase.findById(session.metadata.purchaseId);
        if (!purchase) {
            console.log("Purchase not found");
            return;
        }
        if (session.payment_status === 'paid') {
            purchase.status = 'completed';
            await purchase.save();

            await Promise.all([
                User.findByIdAndUpdate(purchase.userId,{
                    $addToSet:{enrolledCourses:purchase.courseId}
                }),
                Course.findByIdAndUpdate(purchase.courseId,{
                    $addToSet:{enrolledStudents:purchase.userId}
                })
            ])
            console.log(`✅ Successfully enrolled user to course (Purchase ID: ${purchase._id})`);
        }else{
            purchase.status = 'failed';
            await purchase.save();
            console.warn(`Payment failed for puchase ${purchase._id}`)
        }
    } catch (error) {
        console.error('❌ Error handling session:', error);   
    }
}

async function handleSessionFailed(session) {
    const purchase = await Purchase.findByIdAndUpdate(
        session.metadata.purchaseId,
        {status:'failed'},
        {new:true}
    )

    if (!purchase) {
        
    console.log(`💥 Payment failed for purchase ${purchase._id}`);
    }
}
async function handleChargeFailed(charge) {
    const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: charge.payment_intent
    });
    
    if (sessions.data.length > 0) {
        await Purchase.findByIdAndUpdate(
            sessions.data[0].metadata.purchaseId,
            { status: 'failed' }
        );
    }
}
// switch (event.type) {
    //     case 'checkout.session.completed':{
    //         const session = event.data.object;
    //         try {
    //             const {purchaseId} = session.data[0].metadata
    //             const purchaseData = await Purchase.findById(purchaseId)
            
    //             if (session.payment_status === 'completed') {
                    
    //             }
    //         } catch (error) {
                
    //         }
    //         const paymentIntent = event.data.object;
    //         const paymentIntentId = paymentIntent.id
    //         const session = await stripInstance.checkout.sessions.list({
    //             payment_intent: paymentIntentId
    //         })
    //         const userData = await User.findById(purchaseData.userId)
    //         const courseData = await Course.findById(purchaseData.courseId.toString())

    //         courseData.enrolledStudents.push(userData)
    //         await courseData.save()

    //         userData.enrolledCourses.push(courseData)
    //         await userData.save()
            
    //         purchaseData.status = 'completed'
    //         await purchaseData.save()
        
    //         break;
    //     }
    //     case 'payment_intent.payment_failed':{
    //         const paymentIntent = event.data.object;
    //         const paymentIntentId = paymentIntent.id

    //         const session = await stripInstance.checkout.sessions.list({
    //             payment_intent: paymentIntentId
    //         })
    //         const {purchaseId} = session.data[0].metadata;
    //         const purchaseData = await Purchase.findById(purchaseId)
    //         purchaseData.status = 'failed'
    //         await purchaseData.save()
    //         break;
    //     }
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }
