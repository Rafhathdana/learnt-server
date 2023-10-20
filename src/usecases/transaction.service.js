const Razorpay = require("razorpay");

const AppError = require("../frameworks/web/utils/app.error.util");
const crypto = require("crypto");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const generateRazorPayOrder = async ({
  price,
  userId,
  courseId,
  orderId,
  courseTItle,
  user,
}) => {
  let priceInSmallestUnit = price * 100;
  const options = {
    amount: priceInSmallestUnit,
    currency: "INR",
    receipt: orderId,
    notes: {
      user,
      userId,
      course: courseTItle,
      courseId,
    },
  };
  try {
    const order = await instance.orders.create(options);
    return order;
  } catch (err) {
    console.log(`Error happened at Razorpay on orderId : ${orderId}`, err);
    throw AppError.transaction(err.message);
  }
};
const verifyPayment = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  let data = { signatureIsValid: "false" };
  if (expectedSignature === razorpay_signature) {
    data = { signatureIsValid: "true" };
  }
  return data;
};
module.exports = {
  generateRazorPayOrder,
  verifyPayment,
};
