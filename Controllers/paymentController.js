const Razorpay = require("razorpay");
const crypto = require("crypto");
const Checkout = require("../models/checkout");
const PaymentOrder = require('../models/payment_orders');
const PaymentTransaction = require('../models/payment_transactions');
const { razorpayKeyId, razorpaySecret, razorpayWebhookSecret } = require("../constants/constants");

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpaySecret,
});


exports.createPaymentOrder = async (req, res) => {
  try {
    const { checkoutId, amount } = req.body;
    const orderDetails = await Checkout.findById(checkoutId);
    if (!orderDetails) {
      return res.status(404).send({ message: "checkout id not found" });
    }
    const paymentOrder = new PaymentOrder({
      userId: orderDetails.userId,
      checkoutId: checkoutId,
      paidAmount: orderDetails.totalAmount,
      status: "INITIATED"
    });
 const paymentOrderDetails = await paymentOrder.save();
    const finalAmount = (amount * 100).toFixed(2);
    const options = {
      amount: parseFloat(finalAmount),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }
    response = await razorpay.orders.create(options);

    const updateData = {
      orderId: response?.id,
    };

    if (response.id) {
      updateData['status'] = 'CREATED';
      await PaymentOrder.findByIdAndUpdate(paymentOrderDetails._id,{status:  updateData.status, orderId: updateData.orderId}, {
        new: true,
        runValidators: true,
      })
    } else {
      updateData['status'] = 'FAILED';
      await PaymentOrder.findByIdAndUPdate(paymentOrderDetails._id, updateData, {
        new: true, runValidators: true
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
}

exports.capture = async (req, res) => {
  try {
    const paymentOrders = await PaymentOrder.findOne({ orderId: req.body.payload.payment.entity.order_id });

    if(!paymentOrders){
      res.status(400).json({error: "order id is not exist"});
    }
      const secret = razorpayWebhookSecret;
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      var transactionData = {
        orderId: req.body.payload.payment.entity.order_id,
        paymentId: req.body.payload.payment.entity.id,
        paymentType: 'RAZORPAY',
        amount: (req.body.payload.payment.entity.amount) / 100,
        transactionType: req.body.payload.payment.entity.method,
        status: "PROCESSING",
        paymentOrderId: paymentOrders._id
      }
      if (digest === req.headers['x-razorpay-signature']) {
        const transactionDetails = await PaymentTransaction.findOne({ orderId: req.body.payload.payment.entity.order_id });
        if (transactionDetails) {
          if (req.body.event === "payment.captured") {
            await PaymentTransaction.update({
              orderId: req.body.payload.payment.entity.order_id,
              paymentId: req.body.payload.payment.entity.id,
              status: "SUCCESS",
              description: "Payment Success"
            });
            const data = await Checkout.findById(paymentOrders.checkoutId);
            if (!data) {
              const status = 'SUCCESS';
              await Checkout.findByIdAndUpdate( paymentOrders.checkoutId, { paymentStatus: status });
              res.status(200).json({message: "payment success"});
            }
          } else if (req.body.event === "payment.failed") {
            await PaymentTransaction.update({ orderId: req.body.payload.payment.entity.order_id, paymentId: req.body.payload.payment.entity.id }, { status: "FAILED", description: req.body.payload.entity.error_description });
            res.status(400).json({message: "payment Failed"});
          }
         } else {
            if(req.body.event === 'order.paid'){
              const transaction = new PaymentTransaction({
                userId: paymentOrders.userId,
                orderId: transactionData.orderId,
                paymentId:transactionData.paymentId,
                checkoutId: paymentOrders.checkoutId,
                paidAmount: transactionData.amount,
                status: 'SUCCESS'
              });
              await transaction.save();
              const data = await Checkout.findById(paymentOrders.checkoutId);
              if (!data) {
                 transactionData.status = 'SUCCESS';
                await Checkout.findByIdAndUpdate( paymentOrders.checkoutId, { paymentStatus: 'SUCCESS' });
              }
              res.status(200).json({message: "payment success"});
            }else if (req.body.event === 'order.failed') {
              const transaction = new PaymentTransaction({
                userId: paymentOrders.userId,
                orderId: transactionData.orderId,
                paymentId:transactionData.paymentId,
                checkoutId: paymentOrders.checkoutId,
                paidAmount: transactionData.amount,
                status: 'FAILED'
              });
              await transaction.save();
              res.status(400).json({message: "payment failed"});
            }
          
          }
        }
    }catch(error){
      console.error("Error capturing order ", error);
      res.status(500).json({error: "Failed to capture payment"});
    }
  }


