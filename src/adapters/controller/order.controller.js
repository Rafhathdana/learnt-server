const asyncHandler = require("../../frameworks/web/utils/async.handler.util");
const orderService = require("../../usecases/order.service");
const transactionService = require("../../usecases/transaction.service");
const courseService = require("../../usecases/course.service");
const createOrder = asyncHandler(async (req, res) => {
  const response = await orderService.createOrder({
    userId: req.user._id,
    courseId: req.body.courseId,
    user: req.user.name,
  });

  res.status(200).json({
    message: "Order created successfully",
    data: {
      id: response.id, //id from razorpat
      currency: response.currency,
      amount: response.amount,
      orderId: response.orderId, //id stored db for the order
    },
  });
});
const verifyPayment = asyncHandler(async (req, res) => {
  const data = transactionService.verifyPayment(req.body);
  if (data.signatureIsValid) {
    await orderService.updateOrderStatus(req.body.order_id_from_db);
    await courseService.enrollInCourse({
      courseId: req.body.course_id,
      userId: req.user._id,
    });
  }
  res.status(200).json(data);
});
const getAllOrders = asyncHandler(async (req, res) => {
  const ordersByUsers = await orderService.getAllOrders(req.user._id);
  return res.status(200).json({ message: "success", data: ordersByUsers });
});
module.exports = {
  createOrder,
  verifyPayment,
  getAllOrders,
};
