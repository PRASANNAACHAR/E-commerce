
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "../stripe";


// // global variables
// // const currency =  "inr";
// const deliveryCharge = 10


// // gateway initialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// // placing order using cod method
// const placeOrder = async (req,res) =>{
//   try {
    
//     const {userId, items, amount, address} = req.body;
//     const orderData = {
//         userId,
//         items,
//         address,
//         amount,
//         paymentMethod:"COD",
//         payment:false,
//         date: Date.now()
//     }
    
//     const newOrder = new orderModel(orderData)
//     await newOrder.save()

//     await orderModel.findByIdAndUpdate(userId,{cartData:{}})

//     res.json({success:true, message:"order Placed"})


//   } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
    
//   }
// }

// // placing order using stripe method
// const placeOrderStripe = async (req,res) =>{
//    try {
//     const {userId, items, amount, address} = req.body; 
//     const { origin } = req.headers;
    
//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod:"Stripe",
//       payment:false,
//       date: Date.now()
//   }
//   const newOrder = new orderModel(orderData)
//   await newOrder.save()

//   const line_items = items.map((item)=>({
//     price_data: {
//       currency:currency,
//       product_data: {
//         name:item.name
//       },
//       unit_amount:item.price * 100
//     },
//     quantity:item.quantity
//   }))

//    line_items.push({
//     price_data: {
//       currency:currency,
//       product_data: {
//         name: 'Delivery Charges'
//       },
//       unit_amount: deliveryCharge * 100
//     },
//     quantity: 1
//   })
    
//   const session = await stripe.checkout.sessions.create({
//     success_url:`${origin}/verify?success=true&order?Id=${newOrder._id}`,
//     cancel_url: `${origin}/verify?success=false&order?Id=${newOrder._id}`,
//     line_items,
//     mode: 'payment',
//   })

//   res.json({success:true,session_url:session.url});

//    } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
//    }
// }

// // placing order using razorpay method
// const placeOrderRazorpay = async (req,res) =>{

// }

// // all orders data for admin panel
// const allOrders = async (req,res) =>{
//    try {
//     const orders = await orderModel.find({})
//     res.json({success:true, orders})
//    } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
//    }
// }


// // user order data for frontend
// const userOrders = async (req,res) =>{
//    try {
    
//     const {userId } =req.body

//     const orders = await orderModel.find({userId})
//     res.json({success:true, orders})

//    } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message})
//    }
// }

// // update order status from admin panel
// const updateStatus = async (req,res) =>{
//     try {
//       const { orderId, status} = req.body

//       await orderModel.findByIdAndUpdate(orderId,{status})
//       res.json({success:true, message:"Status Updated"})
//     } catch (error) {
//       console.log(error);
//       res.json({success:false,message:error.message})
//     }
// }


// export {placeOrder, placeOrderStripe,placeOrderRazorpay,allOrders, userOrders,updateStatus};




import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Declare constants for delivery charge and currency
const DeliveryCharge = 10;
const currency = 'inr'; // Define delivery charge and currency here
const MINIMUM_STRIPE_AMOUNT = 5000; // 50 cents in INR (₹50)

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// COD order placement
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe order placement
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    // Convert amount to cents and ensure it's at least 50 cents
    const amountInCents = Math.ceil(amount * 100);
    const MINIMUM_AMOUNT_CENTS = 50;
    const validAmountInCents = Math.max(amountInCents, MINIMUM_AMOUNT_CENTS);

    const orderData = {
      userId,
      items,
      address,
      amount: validAmountInCents / 100, // Store amount in INR
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: DeliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// verify stripe
const verifyStripe = async (req,res) => {
  const {orderId,success,userId} = req.body
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {payment: true});
      await userModel.findByIdAndUpdate(userId,{cartData: {}});
      res.json({success: true});
    } else{
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


// Placeholder for Razorpay logic
const placeOrderRazorpay = async (req, res) => {
  
};

// Admin: fetch all orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User: fetch orders for a specific user
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders, 
  userOrders,
  updateStatus,
};

