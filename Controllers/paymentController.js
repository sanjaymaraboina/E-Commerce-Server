const Razorpay = require("razorpay");
const crypto = require("crypto");
const Checkout = require("../models/checkout");
const PaymentOrder = require('../models/payment_orders');

const razorpay = new Razorpay({
  key_id: "rzp_test_9sbpWDETdi1Exn",
  key_secret: "hgcHMAtNzixBnpcVLhghBREM",
});


exports.createPaymentOrder = async (req, res) => {
  try {
    const { checkoutId, amount } = req.body;
    const orderDetails = Checkout.findById(checkoutId);
    if (!orderDetails) {
      return res.status(404).send({ message: "checkout id not found" });
    }
    const orderInfo = new PaymentOrder({
      userId: orderDetails.userId,
      checkoutId: checkoutId,
      paidAmount: orderDetails.totalAmount,
      status: "INITIATED"
    });
    const paymentOrderDetails = await orderInfo.save();

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
      await PaymentOrder.findByIdAndUPdate(paymentOrderDetails._id, updateDate, {
        new: true,
        runValidators: true,
      })
    } else {
      updateData['status'] = 'FAILED';
      await PaymentOrder.findByIdAndUPdate(paymentOrderDetails._id, updateData, {
        new: true, runValidators: true
      });
    }
    res.status(200).json({...orderInfo,response});
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment order" });
  }
}

exports.capture = async (req, res) => {
  try {
    const paymentOrders = await PaymentOrder.find({ orderId: req.body.payload.entity.order_id });
    if (paymentOrders._id) {
      const secret = key_secret;
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      var transactionData = {
        orderId: req.body.payload.entity.order_id,
        paymentId: req.body.payload.payment.entity.id,
        paymentType: 'RAZORPAY',
        amount: (req.body.payload.payment.entity.amount) / 100,
        transactionType: req.body.payload.entity.method,
        status: "PROCESSING",
        paymentOrderId: orderDetails._id
      }
      if (digest === req.headers['x-razorpay-signature']) {
        const transactionDetails = await PaymentTransaction.find({ paymentOrderId: req.body.payload.payment.entity.order_id });
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
              await Checkout.findOneAndUpdate(paymentOrders.checkoutId, { paymentStatus: status });
            }
          } else if (req.body.event === "payment.failed") {
            await PaymentTransaction.update({ orderId: req.body.payload.payment.entity.order_id, paymentId: req.body.payload.payment.entity.id }, { status: "FAILED", description: req.body.payload.entity.error_description });
          }
         } else {
            if(req.body.event === 'order.paid'){
              transactionData.status = 'SUCCESS';
              const data = await Checkout.findById(paymentOrders.checkoutId);
              if (!data) {
                 transactionData.status = 'SUCCESS';
                await Checkout.findOneAndUpdate(paymentOrders.checkoutId, { paymentStatus: transactionData.status });
              }
            }else if (req.body.event === 'order.failed') {
              transactionData.status = 'SUCCESS';
            }
            const transaction = new PaymentTransaction({
              userId: paymentOrders.userId,
              orderId: transactionData.orderId,
              paymentId:transactionData.paymentId,
              checkoutId: paymentOrders.checkoutId,
              paidAmount: transactionData.amount,
              status: transactionData.status
            });
            await transaction.save();
          }
        }
      }
    }catch(error){
      console.error("Error capturing order ", error);
      res.status(500).json({error: "Failed to capture payment"});
    }
  }

exports.createOrder = async (req, res) => {
    try {
      const { amount } = req.body;

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  };

  exports.verifyPayment = (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const generatedSignature = crypto
        .createHmac("sha256", "hgcHMAtNzixBnpcVLhghBREM")
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        res.status(200).json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  };
