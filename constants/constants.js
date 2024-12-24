require("dotenv").config();


 exports.port = process.env.PORT 
 exports.razorpayKeyId = process.env.RAZORPAY_KEY_ID
 exports.razorpaySecret = process.env.RAZORPAY_KEY_SECRET
 exports.razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET