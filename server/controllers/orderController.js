import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js"
import Stripe from "stripe"

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

         await User.findByIdAndUpdate(userId, { cartItems: {} });

        return res.json({success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        const {origin} = req.headers;

        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        let productData = [];

        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        amount += Math.floor(amount * 0.02);

       const order =  await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
         
        });

        await User.findByIdAndUpdate(userId, { cartItems: {} });

    // Stripe Gateway Initialize    
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

     const line_items = productData.map((item)=>{
        return {
            price_data: {
                currency: "usd",
                product_data:{
                    name: item.name,
                },
                unit_amount: Math.floor(item.price + item.price * 0.02)  * 100
            },
            quantity: item.quantity,
        }
     })

     // create session
     const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/loader?next=my-orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
            orderId: order._id.toString(),
            userId,
        }
     })

        return res.json({success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response)=>{
   
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
    
            console.log("WEBHOOK RECEIVED - RAW EVENT DATA:", JSON.stringify(event, null, 2));
    const session = event.data.object;
    console.log("SESSION DETAILS:", {
        id: session.id,
        payment_status: session.payment_status,
        metadata: session.metadata
    });
        // Check if payment was successful
        if (session.payment_status === 'paid') {
            try {
                const { orderId, userId } = session.metadata;
                
                console.log(`Updating order ${orderId} as paid`);
                
                // Update the order in database
                const updatedOrder = await Order.findByIdAndUpdate(
                    orderId,
                    { 
                        isPaid: true,
                        paymentStatus: 'completed',
                        paymentDate: new Date(),
                    },
                    { new: true }
                );
                
                if (!updatedOrder) {
                    console.error(`Order ${orderId} not found`);
                    return response.status(404).json({ error: 'Order not found' });
                }
                
                // Clear user's cart
                await User.findByIdAndUpdate(userId, { cartItems: {} });
                
                console.log(`Successfully updated order ${orderId}`);
            } catch (err) {
                console.error(`Error processing successful payment:`, err);
                return response.status(500).json({ error: 'Failed to update order' });
            }
        }
    }
    response.json({received: true});
}

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const userId = req.user._id;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"},{ paymentType: "Online" }, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        const orders = await Order.find({}).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}